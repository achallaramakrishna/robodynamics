# MindSparc Level 1 QA Report

Date: 2026-05-06  
Level: `level-1`  
URL: `https://robodynamics.in/mindsparc/course/level-1`

## Score

`6.5/10`

## What Was Verified

- live course page returned `200 OK`
- live lesson start route `/mindsparc/course/level-1/lesson/AR_L1_1` returned `200 OK`
- preview SVG `/math-svgs/mindsparc/level-1/number-patterns.svg` returned `200 OK`
- page payload was captured from the live HTML
- representative SVG was downloaded and inspected

## P1 Bugs

### 1. Level 1 is shipped with the wrong product identity in the payload

The rendered page clearly says `MindSparc`, but the embedded payload exposes:
- `product.id = "mindsutra"`
- `product.name = "MindSutra"`

Impact:
- analytics and progress can be attributed to the wrong product
- cross-product state bugs become more likely
- this is a serious product integrity issue

## P2 Bugs

### 2. The local repo does not appear to contain the MindSparc source of truth

In this checkout, there are almost no editable MindSparc source files or local MindSparc SVG assets, while the live site clearly serves them.

Impact:
- QA and bug fixing are harder than they should be
- production may drift away from the repo

### 3. Lesson copy is structurally generic and slightly awkward

Level 1 uses templated phrasing such as:
- `Number Patterns trains math reasoning through find hop sizes...`
- `Practice find hop sizes...`

These are understandable, but they do not read like polished student-facing copy.

Impact:
- weakens product quality impression
- makes the course feel machine-generated rather than carefully authored

## Visual Clarity

The sampled Level 1 SVG is good:
- `number-patterns.svg` is visually clean
- it shows a simple sequence `2, 4, 6, 8, ?`
- it labels the rule clearly with repeated `+2`
- it is easy for a child to understand

So for Level 1, the preview visual is more helpful than confusing.

## Pedagogical Readiness

Level 1 looks age-appropriate and approachable:
- 8 lessons
- concrete topics
- low difficulty
- beginner-friendly visual

This is the strongest MindSparc level from a first-pass QA standpoint.

