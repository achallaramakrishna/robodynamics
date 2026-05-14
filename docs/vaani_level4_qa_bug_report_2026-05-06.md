# Vaani Level 4 QA Bug Report

Date: 2026-05-06
Product: Vaani AI Tutor
Level: Level 4
Scope: Barakhadi curriculum integrity, review-lesson structure, generator fit, and media availability

## Executive Summary

Level 4 is not ready for customer rollout.

The main issues are:
- all 36 Level 4 lessons point to missing image assets in this checkout
- review and consolidation lessons overload fields designed for a single consonant
- the generic Level 4 generator assumes one consonant and one normal barakhadi row, which is a poor fit for several review lessons
- some review anchors are awkward or visibly low-quality

## Severity Scale

- `P1`: release blocker
- `P2`: should be fixed before customer rollout
- `P3`: quality or pedagogy improvement

## Scope Verified

- Level 4 lesson seed data in `vaaniLevel4Data.ts`
- Level 4 lesson generator in `VaaniData.ts`
- presence of referenced image assets in `public/assets/gemini`
- single-consonant assumptions versus review lesson data

## Release Blockers

### 1. All 36 Level 4 lessons point to missing image assets

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel4Data.ts`

Issue:
All Level 4 seeds reference Gemini assets that are not present in local `public/assets/gemini`.

Examples:
- `/assets/gemini/vaani_l4_ka_barakhadi_1777200001.png`
- `/assets/gemini/vaani_l4_kha_barakhadi_1777200025.png`
- `/assets/gemini/vaani_l4_ga_barakhadi_1777200049.png`

Impact:
- the barakhadi lessons lose their intended visual support
- course cards and lesson previews are likely broken or incomplete

### 2. Review and consolidation lessons overload a field model built for one consonant

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel4Data.ts`

Confirmed examples:
- `Barakhadi Consolidation Review`
- `Consonant Pairs Review - क & ख`
- `Consonant Pairs Review - ग & घ`
- `Complete Barakhadi Mastery Celebration`

References:
- [vaaniLevel4Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel4Data.ts:418)
- [vaaniLevel4Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel4Data.ts:1016)
- [vaaniLevel4Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel4Data.ts:1261)

Issue:
Fields like `consonant`, `wordHindi`, and `barakhadiRow` are stretched to represent multi-consonant review content, which is a poor structural fit.

Impact:
- seed semantics become muddy
- generator behavior becomes less trustworthy

## Important Pre-Launch Fixes

### 3. The Level 4 generator assumes a single consonant and fixed barakhadi row structure

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/lib/VaaniData.ts`
- Reference: lines `731-846`

Issue:
The lesson generator:
- always narrates one consonant
- always builds matches from `barakhadiRow[0..2]`
- always quizzes against one `consonant`

This works for normal barakhadi lessons, but not for multi-consonant review lessons.

Impact:
- review lessons are likely to feel awkward or misleading
- the generated practice does not match the broader review intent

### 4. Some review anchors are visibly weak

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel4Data.ts`

Example:
- `कमल & खना` with English `Lotus & Dig`

Reference:
- [vaaniLevel4Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel4Data.ts:1040)

Impact:
- makes the review content look unpolished
- hurts confidence in educational curation

## Conclusion

Level 4 has a stronger curriculum skeleton than Level 2, but it still is not rollout-ready. The missing visual assets and poor structural handling of review lessons are the main blockers.
