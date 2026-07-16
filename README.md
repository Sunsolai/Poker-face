# Poker Face

Poker Face is an app concept for women aged 18-55 who want to upload a selfie and preview possible facial aesthetic changes before making any real-world decision.

The app should help users explore how different facial changes might look on their own face. It is a visualization and education tool, not a medical device and not a substitute for advice from a licensed professional.

## MVP/V1 Decisions

- Real AI generation is required for the MVP.
- The active image generation model should be `gpt-image-2`.
- Gemini image generation is kept only as commented reference code.
- The model should be accessed through a relay API.
- The app should be a desktop-first web application.
- The gallery experience should follow a Pinterest-style masonry layout.
- Mobile migration can happen later when needed.
- V1 does not require user accounts.
- V1 only supports upload-based usage.
- V1 should use browser Local Storage for user-side data persistence.
- Generated results should look realistic, not overly aggressive.
- Prompt strength should be controlled to keep facial changes subtle and plausible.
- The main implementation language should be Python.
- The stack can adapt based on existing project files.

## Current Implementation

- Python standard-library web server in `app.py`
- Static frontend in `static/`
- No required Python package installation for the current MVP
- Browser Local Storage for V1 persistence
- Relay API request handled by the Python backend
- Desktop-first Pinterest-style masonry gallery

## Commands

- **Install:** no package install required for the current MVP
- **Dev:** `python app.py` starts the local server with file watching and automatic restart
- **Open:** `http://127.0.0.1:8000`
- **Syntax check:** `python -m py_compile app.py`

## Environment

Copy `.env.example` values into your shell environment before running the app.

Required for real generation:

- `POKER_FACE_RELAY_URL`
- `POKER_FACE_RELAY_API_KEY`

Optional:

- `PORT`, default `8000`
- `POKER_FACE_MODEL`, default `gpt-image-2`
- `POKER_FACE_RELAY_FORMAT`, default `openai`
- `POKER_FACE_RELAY_AUTH`, default `bearer`
- `POKER_FACE_REQUEST_TIMEOUT`, default `120`

The current GPT image path expects an OpenAI-compatible image edit relay:

```bash
POKER_FACE_MODEL=gpt-image-2
POKER_FACE_RELAY_FORMAT=openai
POKER_FACE_RELAY_AUTH=bearer
```

## Relay API Contract

The active backend path uses GPT image generation through an OpenAI-compatible relay.

- `POKER_FACE_RELAY_FORMAT=openai`: sends an OpenAI-style multipart image edit request with `model`, `prompt`, `image[]`, `n`, `size`, and `quality`.

For OpenAI-compatible relays, `POKER_FACE_RELAY_URL` may be either:

- a base URL, where the app appends `/v1/images/edits`
- a `/v1` URL, where the app appends `/images/edits`
- a full endpoint URL that already ends in `/images/edits`

The backend accepts GPT image responses from common formats, including OpenAI `b64_json`, direct `url`, or generic base64 fields. Gemini `inlineData` parsing remains present for compatibility, but Gemini generation is not active.

Commented Gemini reference code remains in `app.py` for a possible future switch back to Gemini-style `generateContent` payloads.

## Target Users

- Women aged 18-55
- People curious about cosmetic or beauty changes
- Users who want a private, low-pressure way to compare possible looks
- Users who want to understand visual tradeoffs before booking a consultation or buying products

## Core Experience

1. User uploads a clear front-facing photo.
2. The app detects key facial regions.
3. User chooses one or more appearance changes.
4. The app generates realistic preview images.
5. The app displays at least 15 generated previews, with 20 preferred.
6. User reviews the results in a masonry-style visual gallery.
7. User selects any result as the featured preview.
8. User compares before and after versions side by side.
9. User can save, delete, regenerate, or refine the result.

## Result Gallery Layout

After upload, the app should present generated previews in a dense image collage inspired by the reference layout.

Visual structure:

- 3-column masonry grid on mobile
- 4-5 columns on desktop when space allows
- One larger featured preview near the center on mobile
- Small preview cards surrounding the featured image
- Mixed image heights for an organic gallery feel
- Tight, consistent gaps between images
- 8px rounded image corners
- Edge-to-edge image fills inside each card
- Minimal text so faces remain the focus

Recommended mobile behavior:

- Full-screen gallery-first interface
- Sticky bottom action bar for compare, save, delete, and regenerate
- Tap any small preview to make it the featured preview
- Keep the original uploaded photo available for before/after comparison

Recommended desktop behavior:

- Masonry gallery on the left
- Selected preview details on the right
- Before/after comparison in the details panel
- Generation count and status near the top

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

## Default Generated Image Set

The app should generate at least 15 images per uploaded face. The preferred default set contains 20 images:

1. Original
2. Smaller nose
3. Nose bridge refinement
4. Nose tip refinement
5. Lip filler
6. Upper lip enhancement
7. Lower lip enhancement
8. Fox eye lift
9. Brow lift
10. Eyelid lift
11. Face lift
12. Jawline contouring
13. Chin refinement
14. Cheek volume enhancement
15. Cheekbone contouring
16. Forehead smoothing
17. Crow's feet smoothing
18. Under-eye brightening
19. Skin tone variation
20. Skin texture smoothing

Optional extra previews:

- Acne mark reduction
- Pore softening
- Facial slimming
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
- Users can adjust intensity if that effect supports it.
- Users can save selected images.
- Users can delete generated images.
- Users can regenerate a single effect.
- Failed effects can be retried without deleting successful results.

## Loading And Empty States

Before generation:

- Show the uploaded image.
- Show reserved grid spaces for pending previews.
- Avoid layout jumps while results load.

During generation:

- Fill cards progressively as results complete.
- Show a clear progress count, such as "8 of 20 generated".

If generation fails:

- Show which effect failed.
- Let the user retry that effect.
- Keep successful results visible.

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
- Allow users to delete uploaded photos and generated results.
- Do not use photos for training or marketing without explicit consent.
- Avoid storing biometric data unless it is required and clearly disclosed.

## Possible MVP Scope

- Photo upload
- Face detection and alignment
- At least 15 generated preview images
- Masonry-style result gallery
- Featured result selection
- Before and after comparison
- Download or delete generated previews
- Clear privacy and simulation disclaimers

## MVP Acceptance Criteria

- User can upload one face photo.
- App generates at least 15 preset preview images.
- Results appear in a masonry collage inspired by the reference layout.
- User can select any result as the featured preview.
- User can compare the selected result with the original.
- User can delete uploaded and generated images.
- The screen includes a visible simulation disclaimer.

## Future Features

- Multi-change preview combinations
- Adjustable intensity sliders
- Saved look collections
- Consultation preparation notes
- Product recommendations with clear sponsorship labels
- Localized beauty preferences
- Accessibility support
- Mobile-first camera upload flow

## Safety Disclaimer

Poker Face provides visual simulations only. Results may not match real cosmetic procedures, skincare outcomes, makeup results, or medical treatments. Users should consult qualified professionals before making medical, cosmetic, or financial decisions.
