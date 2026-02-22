# AptiPath Adaptive Tree Routing (Phase 2.1)

Date: 2026-02-22

## What changed
- Question sequencing in `aptipath-test.jsp` now follows a balanced binary-style branch model per section.
- For each section:
  - initial set is sampled using a balanced binary traversal over the section pool
  - each answer updates section signal (confidence + pace)
  - branch decision (`LEFT` support / `CENTER` balanced / `RIGHT` stretch)
  - next questions are re-ranked to match branch direction
  - reserve questions from same section can swap in to personalize path

## Why this supports 1000+ questions
- The engine is pool-driven, not fixed-order.
- As question bank grows, tree branching quality improves automatically.
- Student does not need to see all questions; only adaptive path is traversed.

## Next step for full 1000 question rollout
1. Expand each section pool with tagged difficulty and concept metadata.
2. Add DB fields for `difficulty_level`, `concept_code`, `branch_tag`.
3. Seed 1000+ items distributed across sections and sub-concepts.
4. Move branch decision server-side for anti-cheat and analytics integrity.
