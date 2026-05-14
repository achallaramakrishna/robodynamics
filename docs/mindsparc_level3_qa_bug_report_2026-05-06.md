# MindSparc Level 3 QA Report

Date: 2026-05-06  
Level: `level-3`  
URL: `https://robodynamics.in/mindsparc/course/level-3`

## Score

`4.5/10`

## What Was Verified

- live course page returned `200 OK`
- live lesson start route `/mindsparc/course/level-3/lesson/AR_L3_1` returned `200 OK`
- preview asset `/math-svgs/logic/L3-code-matrix-grid.svg` returned `200 OK`
- page payload was captured from the live HTML
- representative SVG was downloaded and inspected

## P1 Bugs

### 1. Level 3 page still identifies the product as MindSutra in the payload

The embedded payload reports:
- `product.id = "mindsutra"`
- `product.name = "MindSutra"`

This remains a serious cross-product bug.

### 2. The sampled Level 3 preview SVG is malformed

`L3-code-matrix-grid.svg` contains invalid XML content for an SVG served as `image/svg+xml`.

Observed problems:
- unescaped `&`-style content risk in labels like `Coding & Decoding`
- inline React-style comment syntax such as `{/* ... */}` inside the SVG text
- XML parsing failed on the downloaded file

Impact:
- preview rendering may break or behave inconsistently across browsers
- this is a real media integrity issue

## P2 Bugs

### 3. Level 3 abruptly changes audience and product tone

Level 1-2 are school-foundation style. Level 3 shifts to:
- `Age 13-14`
- `Scholarship Mastery (NTSE)`

This is not necessarily wrong, but it feels like a new product track rather than a smooth continuation.

### 4. Preview visual is more thematic than explanatory

The sampled SVG looks like a branded coding terminal scene, but it is not as directly instructional as the Level 1 and Level 2 visuals.

Impact:
- weaker teaching clarity
- more decorative than pedagogically explicit

## Pedagogical Readiness

Level 3 feels less ready than Levels 1-2 because:
- there are only 4 lessons
- the tone shifts sharply
- the sampled visual quality is less dependable
- the representative SVG has technical validity issues

