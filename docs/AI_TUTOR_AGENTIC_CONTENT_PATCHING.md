# Agentic Content Patching

This layer turns content cleanup and visual backfilling into a shared pipeline instead of one-off chapter scripts.

## Entry Points

- `node scripts/generate_ai_tutor_catalog.js`
- `node scripts/agentic_content_patch.js --product mindsutra --grade 5`
- `node scripts/agentic_content_patch.js --product mindspark --grade 4 --chapter AR_G4_L1_PATTERNS`
- `node scripts/agentic_content_patch.js --apply --write --product mindsutra --grade 5 --chapter VM_G5_L1_NIKHILAM_NEAR100`
- `node scripts/audit_ai_tutor_content.js`

## What The Engine Does

1. Discovers target courses from the generated shared catalog.
2. Loads the chapter JSON and normalizes mojibake and unsafe text variants.
3. Syncs chapter metadata from the catalog where possible.
4. Chooses the best visual from the shared SVG manifest using product, family, title, subtopics, and concept tokens.
5. Ensures `visualLibrary` exists.
6. Backfills visuals into session flow, exercises, teaching script, and screenplay where those arrays exist.
7. Updates `chapters.json` titles to stay aligned with cleaned chapter titles.
8. Writes a report to `artifacts/agentic_content_patch_report.json`.

## Why This Is Generic

The runtime is not tied to Grade 4 or even to MindSutra.

The same engine works across:

- MindSutra Vedic Math grades
- MindSpark Aptitude & Reasoning grades
- MindSpark campus tracks
- any future family that follows the `content-template/<family>/<course>/chapters.json + chapter/*.json` contract

## Current Resolution Strategy

- `vedic_math` prefers `vedic`, then `series` and `arrows` assets.
- `aptitude_reasoning` prefers `series`, `logic`, `directions`, `data`, `coding`, `patterns`, `shapes`, and `arrows`.
- Matching is based on token overlap between chapter metadata and manifest symbol tags.

## Next Extension Point

If a family needs deeper behavior than generic visual matching, add a family strategy layer on top of the same engine instead of writing new per-chapter patch scripts.
