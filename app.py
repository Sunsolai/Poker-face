from __future__ import annotations

import base64
import json
import mimetypes
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent
STATIC_DIR = ROOT / "static"


def load_env_file() -> None:
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


load_env_file()

MODEL = os.environ.get("POKER_FACE_MODEL", "gpt-image-2")
RELAY_URL = os.environ.get("POKER_FACE_RELAY_URL", "").strip()
RELAY_API_KEY = os.environ.get("POKER_FACE_RELAY_API_KEY", "").strip()
RELAY_FORMAT = os.environ.get("POKER_FACE_RELAY_FORMAT", "openai").strip().lower()
RELAY_AUTH = os.environ.get("POKER_FACE_RELAY_AUTH", "bearer").strip().lower()
REQUEST_TIMEOUT = int(os.environ.get("POKER_FACE_REQUEST_TIMEOUT", "120"))
IMAGE_MODEL_HINTS = ("image", "imagen")
DEV_RELOAD_TOKEN = os.environ.get("POKER_FACE_RELOAD_TOKEN", str(int(time.time() * 1000)))
DEV_CHILD_FLAG = "POKER_FACE_DEV_CHILD"


EFFECT_PROMPTS = {
    "smaller_nose": "Subtly refine the nose so it appears slightly smaller while preserving the person's identity.",
    "nose_bridge": "Subtly refine the nose bridge with a natural, realistic result.",
    "nose_tip": "Subtly refine the nose tip with a natural, realistic result.",
    "lip_filler": "Add a conservative lip filler effect with natural volume and realistic texture.",
    "upper_lip": "Slightly enhance the upper lip while keeping the mouth natural.",
    "lower_lip": "Slightly enhance the lower lip while keeping the mouth natural.",
    "fox_eye": "Create a subtle fox eye lift effect while preserving the person's identity.",
    "brow_lift": "Create a subtle brow lift effect with a natural expression.",
    "eyelid_lift": "Create a subtle eyelid lift effect without changing eye identity.",
    "face_lift": "Create a gentle face lift effect with natural facial proportions.",
    "jawline": "Subtly contour the jawline while keeping the face realistic.",
    "chin": "Subtly refine the chin shape while preserving facial identity.",
    "cheek_volume": "Add subtle cheek volume with realistic skin and lighting.",
    "cheekbone": "Subtly enhance cheekbone definition with a natural look.",
    "forehead_smoothing": "Gently smooth forehead lines while preserving natural skin texture.",
    "crows_feet": "Gently soften crow's feet while preserving natural skin texture.",
    "under_eye": "Brighten the under-eye area naturally without over-smoothing.",
    "skin_tone": "Create a natural alternate skin tone preview while preserving realistic texture.",
    "skin_texture": "Gently smooth skin texture while keeping pores and natural detail.",
    "facial_slimming": "Create a subtle facial slimming preview without changing identity.",
}


def parse_data_url(data_url: str) -> tuple[str, str]:
    match = re.match(r"^data:(?P<mime>[-\w.+/]+);base64,(?P<data>.+)$", data_url, re.DOTALL)
    if not match:
        raise ValueError("Expected image as a base64 data URL.")
    return match.group("mime"), match.group("data")


def build_prompt(effect_label: str, effect_prompt: str, intensity: str) -> str:
    intensity_rules = {
        "subtle": "Use a very subtle intensity.",
        "balanced": "Use a balanced but still realistic intensity.",
        "defined": "Use a clearly visible but not extreme intensity.",
    }
    return (
        "Edit the provided portrait photo for an aesthetic preview. "
        "Preserve the person's identity, age range, facial expression, camera angle, hair, background, and lighting. "
        "Do not sexualize the person. Do not make the result look surgical, exaggerated, artificial, or identity-changing. "
        "Keep natural skin detail and realistic facial anatomy. "
        f"Requested preview: {effect_label}. {effect_prompt} "
        f"{intensity_rules.get(intensity, intensity_rules['balanced'])} "
        "Return one realistic edited image only."
    )


def openai_image_edit_endpoint() -> str:
    url = RELAY_URL.rstrip("/")
    if url.endswith("/images/edits"):
        return url
    if url.endswith("/v1"):
        return f"{url}/images/edits"
    return f"{url}/v1/images/edits"


def request_headers() -> dict[str, str]:
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "PokerFace/1.0 (+https://localhost)",
    }
    if RELAY_API_KEY and RELAY_AUTH == "bearer":
        headers["Authorization"] = f"Bearer {RELAY_API_KEY}"
    return headers


def add_query_key(url: str) -> str:
    if not RELAY_API_KEY or RELAY_AUTH != "query":
        return url
    separator = "&" if "?" in url else "?"
    return f"{url}{separator}key={urllib.parse.quote(RELAY_API_KEY)}"


# Gemini relay reference code, intentionally inactive for the current GPT image path.
# def gemini_relay_endpoint() -> str:
#     if not RELAY_URL:
#         return ""
#     if "{model}" in RELAY_URL:
#         return RELAY_URL.format(model=urllib.parse.quote(MODEL, safe=""))
#     if ":generateContent" not in RELAY_URL:
#         return RELAY_URL.rstrip("/") + f"/v1beta/models/{urllib.parse.quote(MODEL, safe='')}:generateContent"
#     return RELAY_URL
#
#
# def gemini_payload(prompt: str, mime: str, image_b64: str) -> dict[str, Any]:
#     return {
#         "contents": [
#             {
#                 "role": "user",
#                 "parts": [
#                     {"text": prompt},
#                     {"inlineData": {"mimeType": mime, "data": image_b64}},
#                 ],
#             }
#         ],
#         "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
#     }


def multipart_body(fields: dict[str, str], files: list[dict[str, Any]]) -> tuple[bytes, str]:
    boundary = f"----PokerFaceBoundary{int(time.time() * 1000)}"
    chunks: list[bytes] = []
    for name, value in fields.items():
        chunks.append(f"--{boundary}\r\n".encode("utf-8"))
        chunks.append(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode("utf-8"))
        chunks.append(str(value).encode("utf-8"))
        chunks.append(b"\r\n")
    for file_info in files:
        chunks.append(f"--{boundary}\r\n".encode("utf-8"))
        chunks.append(
            (
                f'Content-Disposition: form-data; name="{file_info["field"]}"; '
                f'filename="{file_info["filename"]}"\r\n'
            ).encode("utf-8")
        )
        chunks.append(f'Content-Type: {file_info["mime"]}\r\n\r\n'.encode("utf-8"))
        chunks.append(file_info["content"])
        chunks.append(b"\r\n")
    chunks.append(f"--{boundary}--\r\n".encode("utf-8"))
    return b"".join(chunks), boundary


def extract_image(response: dict[str, Any]) -> str:
    candidates = response.get("candidates", [])
    for candidate in candidates:
        parts = candidate.get("content", {}).get("parts", [])
        for part in parts:
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                mime = inline.get("mimeType") or inline.get("mime_type") or "image/png"
                return f"data:{mime};base64,{inline['data']}"

    data = response.get("data", [])
    if isinstance(data, list) and data:
        first = data[0]
        if first.get("b64_json"):
            return f"data:image/png;base64,{first['b64_json']}"
        if first.get("url"):
            return first["url"]

    for key in ("image", "image_url", "url"):
        if isinstance(response.get(key), str):
            return response[key]
    for key in ("b64_json", "base64", "image_base64"):
        if isinstance(response.get(key), str):
            return f"data:image/png;base64,{response[key]}"

    raise RuntimeError("Relay API response did not include an image.")


def compact_relay_error(status: int, detail: str) -> str:
    try:
        parsed = json.loads(detail)
        error = parsed.get("error", parsed)
        if isinstance(error, dict):
            code = error.get("code")
            message = error.get("message") or error.get("type") or detail
            if code:
                return f"Relay API error {status}: {code} - {message}"
            return f"Relay API error {status}: {message}"
    except json.JSONDecodeError:
        pass
    return f"Relay API error {status}: {detail[:500]}"


def request_openai_image_edit(data_url: str, prompt: str) -> dict[str, Any]:
    mime, image_b64 = parse_data_url(data_url)
    image_bytes = base64.b64decode(image_b64)
    extension = mimetypes.guess_extension(mime) or ".png"
    body, boundary = multipart_body(
        fields={
            "model": MODEL,
            "prompt": prompt,
            "n": "1",
            "size": "1024x1024",
            "quality": "low",
        },
        files=[
            {
                "field": "image[]",
                "filename": f"portrait{extension}",
                "mime": mime,
                "content": image_bytes,
            }
        ],
    )
    headers = request_headers()
    headers["Content-Type"] = f"multipart/form-data; boundary={boundary}"
    request = urllib.request.Request(
        add_query_key(openai_image_edit_endpoint()),
        data=body,
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT) as response:
            raw = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(compact_relay_error(exc.code, detail)) from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Relay API connection failed: {exc.reason}") from exc

    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"Relay API returned non-JSON response: {raw[:300]}") from exc


def generate_image(data_url: str, effect_id: str, effect_label: str, intensity: str) -> dict[str, Any]:
    if not RELAY_URL:
        raise RuntimeError("POKER_FACE_RELAY_URL is not configured.")
    if RELAY_FORMAT != "openai":
        raise RuntimeError("POKER_FACE_RELAY_FORMAT must be 'openai' for the active GPT image path.")

    prompt = build_prompt(effect_label, EFFECT_PROMPTS.get(effect_id, effect_label), intensity)
    parsed = request_openai_image_edit(data_url, prompt)

    # Gemini relay reference flow, intentionally inactive for the current GPT image path.
    # mime, image_b64 = parse_data_url(data_url)
    # payload = gemini_payload(prompt, mime, image_b64)
    # url = add_query_key(gemini_relay_endpoint())
    # body = json.dumps(payload).encode("utf-8")
    # request = urllib.request.Request(url, data=body, headers=request_headers(), method="POST")
    # try:
    #     with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT) as response:
    #         raw = response.read().decode("utf-8")
    # except urllib.error.HTTPError as exc:
    #     detail = exc.read().decode("utf-8", errors="replace")
    #     raise RuntimeError(compact_relay_error(exc.code, detail)) from exc
    # except urllib.error.URLError as exc:
    #     raise RuntimeError(f"Relay API connection failed: {exc.reason}") from exc
    # try:
    #     parsed = json.loads(raw)
    # except json.JSONDecodeError as exc:
    #     raise RuntimeError(f"Relay API returned non-JSON response: {raw[:300]}") from exc

    return {
        "id": f"{effect_id}-{int(time.time() * 1000)}",
        "effectId": effect_id,
        "label": effect_label,
        "image": extract_image(parsed),
        "createdAt": int(time.time()),
        "prompt": prompt,
    }


class PokerFaceHandler(BaseHTTPRequestHandler):
    server_version = "PokerFace/1.0"

    def log_message(self, fmt: str, *args: Any) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def send_json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path == "/api/dev-version":
            self.send_json(200, {"version": DEV_RELOAD_TOKEN})
            return

        if self.path == "/api/config":
            image_model_configured = any(hint in MODEL.lower() for hint in IMAGE_MODEL_HINTS)
            self.send_json(
                200,
                {
                    "model": MODEL,
                    "relayConfigured": bool(RELAY_URL),
                    "imageModelConfigured": image_model_configured,
                    "readyForGeneration": bool(RELAY_URL) and image_model_configured,
                    "relayFormat": RELAY_FORMAT,
                    "storage": "localStorage",
                },
            )
            return

        route = "/" if self.path == "/" else urllib.parse.urlparse(self.path).path
        file_path = STATIC_DIR / ("index.html" if route == "/" else route.lstrip("/"))
        if not file_path.resolve().is_relative_to(STATIC_DIR.resolve()) or not file_path.exists():
            self.send_error(404)
            return

        mime = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
        body = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self) -> None:
        if self.path != "/api/generate":
            self.send_error(404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            if not any(hint in MODEL.lower() for hint in IMAGE_MODEL_HINTS):
                raise RuntimeError(
                    f"Configured model '{MODEL}' is not an image generation model. "
                    "Use an image-capable model enabled by the relay."
                )
            result = generate_image(
                data_url=payload["image"],
                effect_id=payload["effectId"],
                effect_label=payload["label"],
                intensity=payload.get("intensity", "balanced"),
            )
            self.send_json(200, {"result": result})
        except Exception as exc:
            self.send_json(400, {"error": str(exc)})


def main() -> None:
    port = int(os.environ.get("PORT", "8000"))
    host = os.environ.get("HOST", "0.0.0.0")
    server = ThreadingHTTPServer((host, port), PokerFaceHandler)
    print(f"Poker Face running at http://{host}:{port}")
    print("Configure POKER_FACE_RELAY_URL and POKER_FACE_RELAY_API_KEY for real generation.")
    server.serve_forever()


def watched_files() -> list[Path]:
    files = [ROOT / "app.py", ROOT / ".env", ROOT / ".env.example", ROOT / "README.md", ROOT / "AGENTS.md"]
    files.extend(path for path in STATIC_DIR.rglob("*") if path.is_file())
    return files


def watch_snapshot() -> dict[str, int]:
    snapshot: dict[str, int] = {}
    for path in watched_files():
        try:
            snapshot[str(path)] = path.stat().st_mtime_ns
        except OSError:
            snapshot[str(path)] = 0
    return snapshot


def start_child() -> subprocess.Popen[bytes]:
    env = os.environ.copy()
    env[DEV_CHILD_FLAG] = "1"
    env["POKER_FACE_RELOAD_TOKEN"] = str(int(time.time() * 1000))
    return subprocess.Popen([sys.executable, str(ROOT / "app.py")], cwd=ROOT, env=env)


def stop_child(process: subprocess.Popen[bytes]) -> None:
    if process.poll() is not None:
        return
    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=5)


def run_dev_server() -> None:
    print("Poker Face dev watcher running. File changes restart the app automatically.")
    child = start_child()
    snapshot = watch_snapshot()
    try:
        while True:
            time.sleep(1)
            if child.poll() is not None:
                print("App process exited. Restarting...")
                child = start_child()
                snapshot = watch_snapshot()
                continue
            next_snapshot = watch_snapshot()
            if next_snapshot != snapshot:
                print("Change detected. Restarting app...")
                stop_child(child)
                child = start_child()
                snapshot = next_snapshot
    except KeyboardInterrupt:
        stop_child(child)


if __name__ == "__main__":
    if os.environ.get(DEV_CHILD_FLAG) == "1":
        main()
    elif os.environ.get("POKER_FACE_DEV") == "1":
        run_dev_server()
    else:
        main()
