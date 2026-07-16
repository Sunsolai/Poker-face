# AGENTS.md

## Project Overview
- **Project:** Poker Face — an app that lets users upload a selfie and preview possible facial aesthetic changes before taking real-world action.
- **Target user:** women aged 18-55 who want to explore appearance changes safely and privately.
- **My skill level:** intermediate
- **Stack:** see package files

## MVP/V1 Decisions
- **Generation:** MVP must use real AI image generation, not static mock results.
- **Model:** use `gpt-image-2` through an OpenAI-compatible relay API.
- **Gemini:** keep Gemini image generation logic only as commented reference code.
- **Platform:** web app, desktop-first.
- **Gallery:** Pinterest-style masonry gallery experience.
- **Mobile:** defer mobile migration until later unless explicitly requested.
- **Accounts:** no user accounts in V1.
- **Storage:** use browser Local Storage in V1.
- **Realism:** control prompt intensity so results remain realistic and not overly aggressive.
- **Primary language:** Python, while staying flexible based on existing project files.

## Commands
- **Install:** no package install required for the current MVP
- **Dev:** `python app.py`
- **Build:** not required for the current standard-library MVP
- **Test:** `python -m py_compile app.py`
- **Lint:** no linter configured yet

## Do
- Read existing code before modifying anything
- Match existing patterns, naming, and style
- Handle errors gracefully — no silent failures
- Keep changes small and scoped to what was asked
- Run dev/build after changes to verify nothing broke
- Ask clarifying questions before guessing
- Treat user photos as sensitive personal data
- Make privacy, consent, and data deletion behavior clear in the product
- Present appearance previews as simulations, not medical advice or guaranteed outcomes
- For the post-upload result screen, use a dense masonry-style image gallery inspired by the reference layout
- Generate and display at least 15 facial preview images, with 20 preferred for the default result set
- Keep one larger featured preview and let users select smaller previews to replace it
- Preserve access to the original uploaded photo for before/after comparison
- Build the MVP with real AI generation through the configured relay API
- Keep prompt wording conservative so previews look plausible and natural
- Prefer desktop-first web UI decisions for the first version
- Use Local Storage only for V1 user-side persistence unless the user approves a backend storage change

## Don't
- Install new dependencies without asking
- Delete or overwrite files without confirming
- Hardcode secrets, API keys, or credentials
- Rewrite working code unless explicitly asked
- Push, deploy, or force-push without permission
- Make changes outside the scope of the request
- Store uploaded faces longer than necessary without explicit consent
- Make claims that a simulated result is medically accurate
- Encourage users to take cosmetic action without consulting qualified professionals
- Cover key facial areas such as eyes, nose, or lips with labels or controls
- Use language that judges or shames a user's natural features
- Replace real generation with static mock images for MVP unless explicitly asked
- Add accounts, authentication, or cloud persistence in V1 unless explicitly requested
- Make facial edits extreme, exaggerated, or identity-changing by default

## Result Gallery Requirements
- Use the uploaded face as the source image
- Show the original plus generated facial variation previews
- Use a 3-column masonry grid on mobile
- Use 4-5 columns on desktop when space allows
- Keep image gaps tight and consistent, around 8px on mobile and 10-12px on desktop
- Use rounded image cards with an 8px radius
- Make images fill each card edge to edge
- Place a larger featured preview near the center on mobile or left-center on desktop
- Let users tap a card to select it as the featured preview
- Support compare, save, delete, and regenerate actions
- Show loading progress such as "8 of 20 generated"
- If one generation fails, allow retrying that effect without deleting successful results

## When Stuck
- If a task is large, break it into steps and confirm the plan first
- If you can't fix an error in 2 attempts, stop and explain the issue

## Testing
- Run existing tests after any change
- Add at least one test for new features
- Never skip or delete tests to make things pass

## Git
- Small, focused commits with descriptive messages
- Never force push

## Response Style
- always respond with clear & concise messages
- use plain English when explaining to the User
- avoid long sentences, complex words, or long paragraphs
