<p align="center">
  <img src="assets/poker-face-banner.png" alt="Poker Face — AI Facial Aesthetic Preview" width="100%"/>
</p>

<p align="center">
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/语言-简体中文-1B4F72?style=for-the-badge" alt="简体中文"/></a>
  &nbsp;
  <a href="README.md"><img src="https://img.shields.io/badge/Language-English-117A65?style=for-the-badge" alt="English"/></a>
</p>

---

# Poker Face

Poker Face is a desktop-first web app for women aged 18–55 who want to upload a selfie and privately preview possible facial aesthetic changes before making any real-world decision.

> This is a visualization and education tool — not a medical device, and not a substitute for advice from a licensed professional.

## Space Configuration

| Field | Value |
| --- | --- |
| title | Poker Face |
| emoji | 🃏 |
| colorFrom | pink |
| colorTo | gray |
| sdk | docker |
| app_port | 7860 |
| pinned | false |

## Quick Start

1. Copy `.env.example` to `.env` and fill in your relay API key.
2. Run `python server.py`.
3. Open `http://127.0.0.1:8000`.

No package install is required for the current MVP.

## MVP / V1 Decisions

| Topic | Decision |
| --- | --- |
| Generation | Real AI image generation required |
| Active model | `gpt-image-2` |
| Relay | OpenAI-compatible API |
| Gemini | Kept only as commented reference |
| Platform | Desktop-first web app |
| Gallery | Pinterest-style masonry |
| Accounts | Not required in V1 |
| Storage | Lightweight UI state in `localStorage` only |
| Images | Do **not** store base64 images in `localStorage` |
| Realism | Conservative, identity-preserving edits |

## Current Implementation

- Python standard-library web server in `server.py`
- Static frontend in `static/` (with `public/` for Vercel static serving)
- OpenAI-compatible GPT image edit relay using `gpt-image-2`
- Desktop-first masonry gallery with left-side filter panel
- Per-effect generation status and recoverable error cards
- Frontend timeout of 150 seconds per generated image
- Dev watcher + `/api/dev-version` frontend reload polling

## Commands

| Action | Command |
| --- | --- |
| Dev | `python server.py` |
| Open | `http://127.0.0.1:8000` |
| Python syntax check | `python -m py_compile server.py` |
| JS syntax check | `node --check static\app.js` |
| Install | Not required |
| Build | Not required |
| Lint | Not configured yet |

`python server.py` starts a no-dependency development watcher. It restarts the child app when these files change:

- `server.py`
- `.env`
- `.env.example`
- `README.md`
- `AGENTS.md`
- any file under `static/`

The frontend polls `/api/dev-version` every second and refreshes when the backend restart token changes.

## Environment

Copy `.env.example` into `.env` before running. **Do not commit real API keys.**

Required for real generation:

- `POKER_FACE_RELAY_URL`
- `POKER_FACE_RELAY_API_KEY`

```bash
PORT=8000
POKER_FACE_MODEL=gpt-image-2
POKER_FACE_RELAY_URL=https://deepsy.top
POKER_FACE_RELAY_API_KEY=replace-with-your-relay-api-key
POKER_FACE_RELAY_FORMAT=openai
POKER_FACE_RELAY_AUTH=bearer
POKER_FACE_REQUEST_TIMEOUT=120
```

Optional:

- `PORT` — default `8000`
- `POKER_FACE_MODEL` — default `gpt-image-2`
- `POKER_FACE_RELAY_FORMAT` — default `openai`
- `POKER_FACE_RELAY_AUTH` — default `bearer`
- `POKER_FACE_REQUEST_TIMEOUT` — default `120`

## Relay API Contract

Active path uses GPT image generation through an OpenAI-compatible relay.

- `POKER_FACE_RELAY_FORMAT=openai`: multipart image edit request with `model`, `prompt`, `image[]`, `n`, `size`, and `quality`.

`POKER_FACE_RELAY_URL` may be:

- a base URL → appends `/v1/images/edits`
- a `/v1` URL → appends `/images/edits`
- a full endpoint already ending in `/images/edits`

Accepted response formats include OpenAI `b64_json`, direct `url`, or generic base64 fields.

## Backend API

### `GET /api/config`

Returns model, relay, readiness, relay format, and storage state.

### `GET /api/dev-version`

Returns the current development reload token.

### `POST /api/generate`

Generates one edited preview image.

Request:

```json
{
  "image": "data:image/png;base64,...",
  "effectId": "under_eye",
  "label": "Under-eye",
  "intensity": "balanced"
}
```

Response:

```json
{
  "result": {
    "id": "under_eye-1784172558294",
    "effectId": "under_eye",
    "label": "Under-eye",
    "image": "data:image/png;base64,...",
    "createdAt": 1784172558,
    "prompt": "..."
  }
}
```

## Target Users

- Women aged 18–55
- People curious about cosmetic or beauty changes
- Users who want a private, low-pressure way to compare looks
- Users preparing for consultation or product decisions

## Core Experience

1. Upload a clear front-facing photo.
2. Choose one or more appearance changes.
3. Generate realistic previews from the uploaded photo.
4. Browse results in a masonry gallery.
5. Select any result as the featured preview.
6. Compare before and after side by side.
7. Save-toggle, delete, regenerate, or clear the local session.

## Result Gallery Layout

- 3-column masonry on smaller screens; 4 columns on desktop
- One larger featured preview by card sizing rules
- Mixed heights, tight gaps, 8px rounded corners
- Edge-to-edge image fills inside each card
- Sticky left sidebar for upload, intensity, filters, actions, and status

## Appearance Changes

Current default selectable set contains **20** effects:

1. Smaller nose
2. Nose bridge
3. Nose tip
4. Lip filler
5. Upper lip
6. Lower lip
7. Fox eye lift
8. Brow lift
9. Eyelid lift
10. Face lift
11. Jawline
12. Chin refinement
13. Cheek volume
14. Cheekbone
15. Forehead smoothing
16. Crow's feet
17. Under-eye
18. Skin tone
19. Skin texture
20. Facial slimming

Progress uses the selected count, e.g. `2 of 3`.

## Gallery Interaction

- Tap a card to select it as featured.
- Compare selected image with the original.
- Adjust prompt intensity before generation.
- Save-toggle, delete, or regenerate single effects.
- Failed effects can be retried without losing successful results.

## Loading And Empty States

**Before generation**

- Show the uploaded image and selected effect count.

**During generation**

- Fill cards progressively.
- Show progress such as `8 of 20`.
- Show current status such as `Generating Under-eye`.

**If generation fails**

- Show which effect failed and allow retry.
- Keep successful results visible.
- Continue remaining effects when the error is recoverable.
- Stop on hard configuration, auth, or model errors.

## Frontend State And Storage

Lightweight state is stored in `localStorage` under:

```text
poker-face-session-v1
```

Stored fields include selected effect IDs, selected card ID, and small result metadata.

Uploaded and generated base64 images are **not** stored in `localStorage`; they stay in browser memory for the active page session.

If saving fails, `safeSaveState()` logs the issue and generation continues.

## Important Product Principles

- Results must be labeled as simulations.
- Do not promise medical accuracy or real procedure outcomes.
- Encourage consulting licensed professionals before procedures.
- Treat uploaded photos as sensitive personal data.
- Avoid language that shames natural facial features.
- Keep the product voice supportive, neutral, and clear.
- Labels must not cover eyes, nose, or lips.

## Privacy Requirements

- Ask for consent before processing photos.
- Make retention rules clear.
- Allow clearing uploaded photos and generated results from the local session.
- Do not use photos for training or marketing without explicit consent.
- Do not commit `.env`, API keys, user photos, generated face images, or logs.

## MVP Acceptance Criteria

- Upload one face photo.
- Choose one or more preview effects.
- Generate realistic previews through the configured relay.
- Show results in a masonry collage.
- Select a featured preview and compare with the original.
- Delete uploaded and generated images from the local session.
- Show a visible simulation disclaimer.
- Do not persist generated images in `localStorage`.

## Future Features

- IndexedDB or temporary backend image storage
- Download generated previews
- Multi-change combinations
- Adjustable intensity sliders
- Saved look collections
- Consultation preparation notes
- Mobile-first camera upload flow

## Git Notes

Runtime files ignored by Git:

- `.env`
- `__pycache__/`
- `*.pyc`
- `server.out.log`
- `server.err.log`

## References

- [CODEX FULL COURSE: From Zero to Deployed App (2026)](https://www.youtube.com/watch?v=hoCWD1aI60Y&t=4662s)

## Safety Disclaimer

Poker Face provides visual simulations only. Results may not match real cosmetic procedures, skincare outcomes, makeup results, or medical treatments. Users should consult qualified professionals before making medical, cosmetic, or financial decisions.
