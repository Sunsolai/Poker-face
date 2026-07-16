# Poker Face

Poker Face is an app concept for women aged 18-55 who want to upload a selfie and preview possible facial aesthetic changes before making any real-world decision.

The app should help users explore how different facial changes might look on their own face. It is a visualization and education tool, not a medical device and not a substitute for advice from a licensed professional.

## MVP/V1 Decisions

- Real AI generation is required for the MVP.
- The active image generation model should be `gpt-image-2`.
- Gemini image generation is kept only as commented reference code.
- The model should be accessed through an OpenAI-compatible relay API.
- The app should be a desktop-first web application.
- The gallery experience should follow a Pinterest-style masonry layout.
- Mobile migration can happen later when needed.
- V1 does not require user accounts.
- V1 only supports upload-based usage.
- V1 should use browser Local Storage for lightweight user-side UI state.
- Uploaded and generated base64 images must not be stored in Local Storage.
- Generated results should look realistic, not overly aggressive.
- Prompt strength should be controlled to keep facial changes subtle and plausible.
- The main implementation language should be Python.
- The stack can adapt based on existing project files.

## Current Implementation

- Python standard-library web server in `app.py`
- Static frontend in `static/`
- No required Python package installation for the current MVP
- Browser Local Storage for lightweight V1 persistence only
- Generated image data is kept in browser memory for the active page session
- Relay API request handled by the Python backend
- OpenAI-compatible GPT image edit relay using `gpt-image-2`
- Gemini relay logic retained only as commented reference code in `app.py`
- Desktop-first Pinterest-style masonry gallery
- Left-side filter panel for choosing which preview effects to generate
- Per-effect generation status and recoverable error cards
- Frontend timeout of 150 seconds per generated image
- Dev watcher in `app.py` for automatic backend restart
- Frontend reload polling through `/api/dev-version`

## Commands

- **Install:** no package install required for the current MVP
- **Dev:** `python app.py`
- **Open:** `http://127.0.0.1:8000`
- **Syntax check:** `python -m py_compile app.py`
- **JS syntax check:** `node --check static\app.js`
- **Build:** not required for the current standard-library MVP
- **Lint:** no linter configured yet

`python app.py` starts a no-dependency development watcher. It starts the actual app as a child process and restarts it when these files change:

- `app.py`
- `.env`
- `.env.example`
- `README.md`
- `AGENTS.md`
- any file under `static/`

The frontend polls `/api/dev-version` every second and refreshes the page when the backend restart token changes.

## Environment

Copy `.env.example` values into `.env` before running the app. Do not commit real API keys.

Required for real generation:

- `POKER_FACE_RELAY_URL`
- `POKER_FACE_RELAY_API_KEY`

Current example:

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

- `PORT`, default `8000`
- `POKER_FACE_MODEL`, default `gpt-image-2`
- `POKER_FACE_RELAY_FORMAT`, default `openai`
- `POKER_FACE_RELAY_AUTH`, default `bearer`
- `POKER_FACE_REQUEST_TIMEOUT`, default `120`

## Relay API Contract

The active backend path uses GPT image generation through an OpenAI-compatible relay.

- `POKER_FACE_RELAY_FORMAT=openai`: sends an OpenAI-style multipart image edit request with `model`, `prompt`, `image[]`, `n`, `size`, and `quality`.

For OpenAI-compatible relays, `POKER_FACE_RELAY_URL` may be either:

- a base URL, where the app appends `/v1/images/edits`
- a `/v1` URL, where the app appends `/images/edits`
- a full endpoint URL that already ends in `/images/edits`

The backend accepts GPT image responses from common formats, including OpenAI `b64_json`, direct `url`, or generic base64 fields. Gemini `inlineData` parsing remains present for compatibility, but Gemini generation is not active.

Commented Gemini reference code remains in `app.py` for a possible future switch back to Gemini-style `generateContent` payloads.

## Backend API

### `GET /api/config`

Returns model, relay, readiness, relay format, and storage state for the frontend.

### `GET /api/dev-version`

Returns the current development reload token. The frontend uses this endpoint to detect backend restarts and refresh the page.

### `POST /api/generate`

Generates one edited preview image.

Request body:

```json
{
  "image": "data:image/png;base64,...",
  "effectId": "under_eye",
  "label": "Under-eye",
  "intensity": "balanced"
}
```

Response body:

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

- Women aged 18-55
- People curious about cosmetic or beauty changes
- Users who want a private, low-pressure way to compare possible looks
- Users who want to understand visual tradeoffs before booking a consultation or buying products

## Core Experience

1. User uploads a clear front-facing photo.
2. User chooses one or more appearance changes from the preview filter panel.
3. The app generates realistic preview images using the uploaded photo as source.
4. The app displays generated previews in a masonry-style visual gallery.
5. User selects any result as the featured preview.
6. User compares before and after versions side by side.
7. User can save-toggle, delete, regenerate, or clear the local session.

## Result Gallery Layout

After upload, the app should present generated previews in a dense image collage inspired by the reference layout.

Visual structure:

- 3-column masonry grid on smaller screens when space allows
- 4 columns on desktop in the current implementation
- One larger featured preview by card sizing rules
- Small preview cards surrounding the featured image
- Mixed image heights for an organic gallery feel
- Tight, consistent gaps between images
- 8px rounded image corners
- Edge-to-edge image fills inside each card
- Minimal text so faces remain the focus

Current desktop behavior:

- Sticky left sidebar for upload, intensity, effect filters, generation actions, and status
- Masonry gallery in the main workspace
- Compare panel can show original and selected preview
- Generation count and current effect status are shown in the sidebar

## Appearance Changes

Initial preview options should include:

- Original
- Smaller nose
- Nose bridge refinement
- Nose tip refinement
- Lip filler
- Upper lip enhancement
- Lower lip enhancement
- Fox eye lift
- Eyelid lift
- Brow lift
- Face lift
- Jawline contouring
- Chin refinement
- Cheek volume enhancement
- Cheekbone contouring
- Botox-style forehead smoothing
- Botox-style crow's feet smoothing
- Smile line softening
- Under-eye brightening
- Dark circle reduction
- Skin tone variations
- Skin texture smoothing
- Acne mark reduction
- Pore softening
- Facial slimming
- Double chin reduction
- Teeth whitening preview
- Hair color preview
- Eyebrow shape preview
- Makeup style preview
- Aging and younger-look preview

## Current Generated Image Set

The current default selectable set contains 20 effects:

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

The app lets users select a subset before generation. The progress indicator uses the selected count, such as `2 of 3`.

Optional future previews:

- Acne mark reduction
- Pore softening
- Double chin reduction
- Teeth whitening
- Hair color preview
- Eyebrow shape preview
- Makeup style preview
- Younger-look preview
- Mature-look preview

## Common Facial Cosmetic Procedures

Based on current plastic surgery and facial aesthetic procedure references, the app should consider these commonly requested facial cosmetic procedures and treatments:

- Rhinoplasty
- Revision rhinoplasty
- Eyelid surgery
- Upper eyelid surgery
- Lower eyelid surgery
- Facelift
- Mini facelift
- Deep plane facelift
- Neck lift
- Brow lift
- Forehead lift
- Thread lift
- Buccal fat removal
- Cheek augmentation
- Cheek filler
- Chin surgery
- Chin implant
- Jawline contouring
- Facial implants
- Facial fat grafting
- Lip augmentation
- Lip filler
- Lip lift
- Botulinum toxin treatment
- Dermal fillers
- Under-eye filler
- Chemical peel
- Dermabrasion
- Microdermabrasion
- Laser skin resurfacing
- Skin rejuvenation and resurfacing
- Laser hair removal
- Nonsurgical fat reduction under the chin
- Ear surgery
- Hairline lowering or hair restoration near the face

## Gallery Interaction

- Tapping a card selects it.
- Selected card becomes the featured image.
- Users can compare selected image with the original.
- Users can adjust prompt intensity before generation.
- Users can save-toggle selected images during the active session.
- Users can delete generated images.
- Users can regenerate a single effect.
- Failed effects can be retried without deleting successful results.

## Loading And Empty States

Before generation:

- Show the uploaded image.
- Show the selected effect count.
- Avoid layout jumps while results load.

During generation:

- Fill cards progressively as results complete.
- Show a clear progress count, such as `8 of 20`.
- Show current generation status, such as `Generating Under-eye`.
- Apply a 150 second frontend timeout per generated image.

If generation fails:

- Show which effect failed.
- Let the user retry that effect.
- Keep successful results visible.
- Continue remaining selected effects when the error is recoverable.
- Stop on hard configuration, auth, or model errors.

## Frontend State And Storage

The frontend stores lightweight state in `localStorage` under:

```text
poker-face-session-v1
```

Stored fields include selected effect IDs, selected card ID, and small result metadata.

The app does not store uploaded or generated base64 images in `localStorage`. Browser Local Storage is too small for 15-20 generated images, so image data stays in memory for the current page session.

If an old session contains base64 images, the app migrates it to lightweight state on load. If state saving fails, `safeSaveState()` logs the issue and generation continues.

## Important Product Principles

- Results must be labeled as simulations.
- The app must not promise medical accuracy or real procedure outcomes.
- Users should be encouraged to consult licensed professionals before cosmetic procedures.
- Uploaded photos are sensitive personal data.
- The app should explain how photos are stored, processed, and deleted.
- The app should avoid language that shames natural facial features.
- The product voice should be supportive, neutral, and clear.
- Labels must not cover important facial areas such as eyes, nose, or lips.
- Effect names should be neutral and short.

## Privacy Requirements

- Ask for consent before processing photos.
- Make photo retention rules clear.
- Allow users to clear uploaded photos and generated results from the local session.
- Do not use photos for training or marketing without explicit consent.
- Avoid storing biometric data unless it is required and clearly disclosed.
- Do not commit `.env`, API keys, user photos, generated face images, or logs.

## Possible MVP Scope

- Photo upload
- Selectable preview effects
- Real AI image generation through relay API
- At least 15 generated preview images when enough effects are selected
- Masonry-style result gallery
- Featured result selection
- Before and after comparison
- Delete generated previews
- Clear privacy and simulation disclaimers
- Lightweight browser-side persistence

## MVP Acceptance Criteria

- User can upload one face photo.
- User can choose one or more preview effects.
- App generates realistic preset preview images through the configured relay.
- Results appear in a masonry collage inspired by the reference layout.
- User can select any result as the featured preview.
- User can compare the selected result with the original.
- User can delete uploaded and generated images from the local session.
- The screen includes a visible simulation disclaimer.
- Generated images are not persisted in `localStorage`.

## Future Features

- IndexedDB or backend temporary image storage
- Download generated previews
- Multi-change preview combinations
- Adjustable intensity sliders
- Saved look collections
- Consultation preparation notes
- Product recommendations with clear sponsorship labels
- Localized beauty preferences
- Accessibility support
- Mobile-first camera upload flow

## Git Notes

Runtime files ignored by Git:

- `.env`
- `__pycache__/`
- `*.pyc`
- `server.out.log`
- `server.err.log`

## Safety Disclaimer

Poker Face provides visual simulations only. Results may not match real cosmetic procedures, skincare outcomes, makeup results, or medical treatments. Users should consult qualified professionals before making medical, cosmetic, or financial decisions.

