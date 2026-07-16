# AGENTS.md

## Project Overview

- **Project:** Poker Face — a desktop-first web MVP that lets users upload a portrait photo and generate realistic facial aesthetic preview images.
- **Target user:** women aged 18-55 who want to explore appearance changes safely and privately.
- **Primary language:** Python, with a standard-library backend and static frontend.
- **Current files:** `app.py`, `static/index.html`, `static/app.js`, `static/styles.css`, `.env.example`, `README.md`, `AGENTS.md`.

## Current Implementation

- `app.py` serves static files, exposes JSON APIs, calls the image relay, and runs the dev watcher.
- `static/app.js` handles upload, filter selection, generation flow, lightweight state persistence, and frontend reload polling.
- `static/styles.css` implements the desktop-first sidebar, filter chips, status panel, and masonry gallery.
- `static/index.html` contains the app shell, upload controls, preview filters, status rows, compare panel, and gallery template.
- No package install is required for the current MVP.

## MVP/V1 Decisions

- **Generation:** MVP must use real AI image generation, not static mock results.
- **Active model:** use `gpt-image-2` through an OpenAI-compatible relay API.
- **Relay format:** active path is `POKER_FACE_RELAY_FORMAT=openai`.
- **Gemini:** keep Gemini image generation logic only as commented reference code in `app.py`.
- **Platform:** desktop-first web app.
- **Gallery:** Pinterest-style masonry gallery.
- **Mobile:** defer mobile migration unless explicitly requested.
- **Accounts:** no accounts or authentication in V1.
- **Storage:** use browser `localStorage` only for lightweight UI state.
- **Images:** do not store uploaded or generated base64 images in `localStorage`.
- **Realism:** keep prompt intensity conservative and identity-preserving.

## Commands

- **Install:** no package install required.
- **Dev:** `python app.py`
- **Open:** `http://127.0.0.1:8000`
- **Test:** `python -m py_compile app.py`
- **JS syntax check:** `node --check static\app.js`
- **Build:** not required.
- **Lint:** no linter configured.

`python app.py` starts a no-dependency dev watcher. It restarts the child app process when `app.py`, `.env`, `.env.example`, `README.md`, `AGENTS.md`, or files under `static/` change. The frontend polls `/api/dev-version` and reloads after backend restarts.

## Environment

Use `.env.example` as the template:

```bash
PORT=8000
POKER_FACE_MODEL=gpt-image-2
POKER_FACE_RELAY_URL=https://deepsy.top
POKER_FACE_RELAY_API_KEY=replace-with-your-relay-api-key
POKER_FACE_RELAY_FORMAT=openai
POKER_FACE_RELAY_AUTH=bearer
POKER_FACE_REQUEST_TIMEOUT=120
```

Never hardcode or commit real API keys. `.env` is ignored by Git.

## Do

- Read existing code before modifying anything.
- Keep changes small and scoped to the request.
- Match current plain JavaScript, HTML, CSS, and Python standard-library patterns.
- Preserve the no-install MVP unless the user approves new dependencies.
- Handle errors visibly and gracefully.
- Keep generation failures isolated per effect when possible.
- Use `safeSaveState()` for frontend persistence so storage failures do not break generation.
- Keep `localStorage` state lightweight; persist metadata only.
- Treat user photos as sensitive personal data.
- Present previews as simulations, not medical advice.
- Keep prompts realistic, conservative, and identity-preserving.
- Run `python -m py_compile app.py` after backend changes.
- Run `node --check static\app.js` after frontend JS changes.

## Don't

- Do not install dependencies without asking.
- Do not add accounts, authentication, backend storage, or cloud persistence unless requested.
- Do not commit `.env`, API keys, user photos, generated images, or logs.
- Do not store uploaded or generated base64 images in `localStorage`.
- Do not replace real generation with static mock images unless explicitly asked.
- Do not remove the GPT image path in favor of Gemini.
- Do not uncomment or activate Gemini generation unless explicitly requested.
- Do not make facial edits extreme, exaggerated, or identity-changing by default.
- Do not use language that judges or shames natural facial features.
- Do not cover important face areas with labels or controls.
- Do not push, deploy, force-push, or rewrite Git history without permission.

## Result Gallery Requirements

- Use the uploaded face as the source image for generation.
- Show the original plus generated facial variation previews during the active session.
- Use a masonry grid with tight gaps.
- Use rounded image cards with an 8px radius.
- Make images fill cards edge to edge.
- Support selecting a card as the featured preview.
- Support compare, save toggle, delete, and regenerate.
- Show progress such as `8 of 20`.
- Show current generation status, such as `Generating Under-eye`.
- If one effect fails, keep successful results and continue when the error is recoverable.

## Current Preview Effects

- Smaller nose
- Nose bridge
- Nose tip
- Lip filler
- Upper lip
- Lower lip
- Fox eye lift
- Brow lift
- Eyelid lift
- Face lift
- Jawline
- Chin refinement
- Cheek volume
- Cheekbone
- Forehead smoothing
- Crow's feet
- Under-eye
- Skin tone
- Skin texture
- Facial slimming

## Privacy And Safety

- Uploaded face photos are sensitive personal data.
- The MVP keeps image data in browser memory for the active page session.
- Lightweight UI state may be stored in `localStorage`.
- Users must be able to clear local session state.
- Results must be labeled and treated as simulations.
- Do not claim medical accuracy or guaranteed real-world outcomes.
- Users should consult qualified professionals before cosmetic procedures.

## Git

- Make small, focused commits with descriptive messages when asked.
- Never force push.
- Do not revert user changes unless explicitly requested.
- Runtime files ignored by Git include `.env`, `__pycache__/`, `*.pyc`, `server.out.log`, and `server.err.log`.

## When Stuck

- If a task is large, break it into steps and confirm the plan first.
- If the same error cannot be fixed after two serious attempts, stop and explain the issue.

## Response Style

- Always respond with clear and concise messages.
- Use plain English when explaining to the user.
- Avoid long paragraphs and unnecessary detail.

