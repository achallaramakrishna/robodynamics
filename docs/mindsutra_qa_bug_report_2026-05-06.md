# MindSutra QA Bug Report

Date: 2026-05-06  
Product: MindSutra  
Scope: Source checkout audit, production route verification, Vedic SVG clarity review, progress/personalization wiring review

## Overall Verdict

MindSutra has strong product intent and some genuinely good instructional visuals, but it is not customer-ready in its current state.

Current score: **4/10**

Why:
- some Vedic SVGs are clear and useful for teaching
- the progress/personalization layer is partially implemented
- the local checkout does not contain a complete MindSutra app
- several important production SVGs are still placeholder boards, not teaching diagrams
- the asset system and product boundaries look mixed between MindSutra and MindSparc

## What Was Verified

- live route `https://robodynamics.in/mindsutra` returns `200 OK`
- local source files for MindSutra progress and personalization exist
- local course page exists only under `app/mindsutra_BAK/course/[level]/page.tsx`
- Vedic SVG assets are packaged inside `ai-tutor/web/public.tar.gz`
- representative SVGs were inspected for pedagogical clarity
- production-served SVG asset paths were checked

## P1 Bugs

### 1. MindSutra source is incomplete in this checkout

The repo contains only partial MindSutra implementation. Present pieces include:
- `ai-tutor/web/lib/mindsutraSkillMasteryDb.ts`
- `ai-tutor/web/lib/mindsutraPersonalization.ts`
- `ai-tutor/web/app/api/mindsutra/progress/route.ts`
- `ai-tutor/web/app/mindsutra_BAK/course/[level]/page.tsx`

However, core files referenced by the existing code are missing from this checkout, including:
- `ai-tutor/web/lib/mindsutraCatalog.ts`
- `ai-tutor/web/lib/mindsutraCourseData.ts`
- `ai-tutor/web/lib/mindsutraLessonTypes.ts`
- `MindSutraCourseClient`

Impact:
- end-to-end source QA is blocked
- content fixes cannot be made confidently from this checkout
- this repo state is not reliable enough for release maintenance

Key reference:
- `ai-tutor/web/app/mindsutra_BAK/course/[level]/page.tsx`

### 2. Important Vedic SVGs are placeholders, not explanatory lesson visuals

Several production SVGs are not real teaching diagrams. They are wireframe boards containing text such as:

`Dynamic content logic to be injected by AnimatedBoard`

Example inspected:
- `public/math-svgs/vedic/full-urdhva-board.svg`

This file shows:
- a dark board template
- placeholder title treatment
- an `ASSET_ID`
- no actual worked example for the child to learn from

Impact:
- students cannot understand the method from the SVG alone
- lessons will feel unfinished or confusing
- parent trust and demo quality will drop sharply

Representative placeholder-style assets found in the library include:
- `a3-a2b-ab2-b3-strip.svg`
- `adjusted-base-board.svg`
- `anurupyena-base-scaling-panel.svg`
- `any-base-cross-board.svg`
- `binomial-area-model.svg`
- `binomial-cube-board.svg`
- `full-urdhva-board.svg`
- `near-1000-multiplication-board.svg`

### 3. Placeholder visual assets are being served in production

This is not just a local asset-library issue. Placeholder SVGs are present in the shipped bundle and are reachable through production asset URLs.

Impact:
- unfinished lesson visuals may already be visible to users
- customer demos can expose internal placeholder content

## P2 Bugs

### 4. SVG quality is inconsistent across the product

MindSutra currently mixes:
- clear, worked, student-readable SVGs
- abstract helper components
- incomplete placeholder boards

This inconsistency is a serious pedagogy problem. A math teaching product should not make the student guess whether a diagram is the explanation or just a background component.

### 5. Asset manifest is mislabeled as MindSpark

`ai-tutor/web/public.tar.gz -> public/math-svgs/manifest.json` contains:

`"description": "MindSpark reusable SVG symbol library for animated board steps"`

But the same manifest also declares Vedic Math diagrams used by MindSutra.

Impact:
- product boundary confusion
- raises risk of wrong assets being surfaced in the wrong product
- signals weak asset governance

### 6. Course page exists only under a backup path locally

The available page source is:
- `ai-tutor/web/app/mindsutra_BAK/course/[level]/page.tsx`

This is a concern because:
- it suggests the source in this checkout may not match the deployed app
- the local project structure does not reflect a normal maintained production route

## P3 Bugs

### 7. MindSparc page payload appears to leak MindSutra product identity

While inspecting `https://robodynamics.in/mindsparc/course/level-1`, the page content represented the course as MindSparc, but the embedded payload exposed:
- `product.id = "mindsutra"`
- `product.name = "MindSutra"`

This is outside the core MindSutra route, but it strongly suggests cross-product data leakage in the course payload layer.

Impact:
- analytics contamination
- wrong branding in derived UI states
- possible progress or enrollment cross-wiring risk

## SVG Clarity Assessment

### Strong Example

`public/math-svgs/vedic/complement_all_from_9.svg`

This SVG is good for teaching because it:
- names the rule clearly: `All From 9, Last From 10`
- gives a concrete example: `1000 - 364`
- isolates each digit visually
- shows the exact transformation under each digit
- color-codes the special last-step behavior
- reveals the final answer clearly

This is the standard the rest of the visual system should meet.

### Weak / Confusing Example

`public/math-svgs/vedic/full-urdhva-board.svg`

This SVG is not clear for a student because it:
- does not show a worked problem
- does not explain the criss-cross sequence
- contains placeholder system text
- looks like an internal layout frame rather than a teaching asset

For a child learning Vedic Math, this kind of SVG is confusing, not helpful.

## Pedagogical Conclusion on SVGs

The SVG layer is currently **mixed-quality**:

- some diagrams are genuinely clear and classroom-usable
- many others are not self-explanatory
- several appear to be internal board templates rather than student-facing teaching assets

So the answer to the original question is:

**No, the SVGs are not consistently clear enough right now to reliably help a student understand a Vedic Math problem.**

Some are strong. Too many are incomplete or confusing.

## Readiness Assessment

### Strengths

- good market concept
- partial personalization/progress framework exists
- some high-quality Vedic visuals already created

### Weaknesses

- incomplete local source of truth
- inconsistent asset governance
- placeholder boards in production bundle
- not enough assurance that every visual is student-comprehensible

## Recommended Fix Order

1. Reconstruct or restore the complete MindSutra source tree in the repo.
2. Create an inventory of all student-facing Vedic SVGs and classify them as:
   - ready
   - helper-only
   - placeholder
   - wrong product
3. Remove placeholder SVGs from any lesson path that can reach customers.
4. Rewrite weak visuals into worked-example diagrams like `complement_all_from_9.svg`.
5. Separate MindSutra and MindSparc asset manifests and payload identities.
6. Re-run lesson-by-lesson QA once the complete source is available.

## Final Score

MindSutra today: **4/10**

Breakdown:
- concept: `8/10`
- visual potential: `6/10`
- actual SVG clarity consistency: `4/10`
- source completeness: `2/10`
- customer readiness: `3/10`

