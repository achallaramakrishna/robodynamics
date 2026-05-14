# MindSparc Level 4 QA Report

Date: 2026-05-06  
Level: `level-4`  
URL: `https://robodynamics.in/mindsparc/course/level-4`

## Score

`4/10`

## What Was Verified

- live course page returned `200 OK`
- live lesson start route `/mindsparc/course/level-4/lesson/AR_L4_1` returned `200 OK`
- preview asset `/math-svgs/logic/L4-perm-combo-lock.svg` returned `200 OK`
- page payload was captured from the live HTML
- representative SVG was downloaded and inspected

## P1 Bugs

### 1. Level 4 payload still says MindSutra instead of MindSparc

The same identity mismatch persists:
- `product.id = "mindsutra"`
- `product.name = "MindSutra"`

## P2 Bugs

### 2. Level 4 does not feel like a natural continuation of a K-12 Olympiad product

The level is presented as:
- `Age 15-18`
- `The Entrance Exam Prep Studio`

This is a major audience and brand shift from the lower levels.

Impact:
- weak product coherence
- students and parents may not understand what MindSparc actually is

### 3. Sampled Level 4 visual is more decorative than instructional

`L4-perm-combo-lock.svg` looks like a gamified dashboard for permutations/combinations, but it does not clearly teach the math method itself.

What it lacks:
- no worked example
- no formula explanation
- no concrete problem-solving flow

Impact:
- the image may look premium, but it does not strongly support learning

## Pedagogical Readiness

Level 4 currently feels more like a concept shell than a mature teaching product.

