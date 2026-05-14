# MindSparc Level 5 QA Report

Date: 2026-05-06  
Level: `level-5`  
URL: `https://robodynamics.in/mindsparc/course/level-5`

## Score

`3.5/10`

## What Was Verified

- live course page returned `200 OK`
- live lesson start route `/mindsparc/course/level-5/lesson/AR_L5_1` returned `200 OK`
- preview asset `/math-svgs/logic/L5-ds-data-vault.svg` returned `200 OK`
- page payload was captured from the live HTML
- representative SVG was downloaded and inspected

## P1 Bugs

### 1. Level 5 page also exposes MindSutra identity in the payload

The embedded payload still reports:
- `product.id = "mindsutra"`
- `product.name = "MindSutra"`

This issue affects every MindSparc level reviewed.

## P2 Bugs

### 2. Level 5 appears to be a different product masquerading as a MindSparc level

The page is targeted at:
- `18+ Professionals`
- `Elite Performance Training`
- `FAANG`
- `GMAT`

This is no longer a natural continuation of a school reasoning product.

Impact:
- major brand dilution
- curriculum incoherence
- unclear buyer and unclear learner persona

### 3. Sampled Level 5 visual is not very pedagogically clear

`L5-ds-data-vault.svg` is styled like a control dashboard with statement panels and answer selectors, but it does not clearly explain how data sufficiency should be solved.

Impact:
- advanced learners may still need better teaching scaffolds
- the visual helps theme more than understanding

## Pedagogical Readiness

Level 5 is the weakest from a product-positioning standpoint:
- the audience jumps from student to professional
- the lesson branding is flashy but not especially explanatory
- it feels like a separate aptitude-prep product

