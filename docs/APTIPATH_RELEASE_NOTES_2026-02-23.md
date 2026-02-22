# AptiPath Release Notes - 2026-02-23

## Scope
This release improves AptiPath result authenticity for parents/students and adds visual score explainability.

## New Features
1. Accuracy-anchored scoring
- Section performance is now correctness-driven for answered questions.
- Removed option-letter bias (`A/B/C/D`) that could inflate section values even when answers were wrong.
- Section score now uses weighted averages by question weight.

2. Career Health Score recalibration
- Career Health Score now uses:
  - `65%` assessed test accuracy (objective correctness)
  - `35%` overall readiness context
- Formula used:
  - `CareerHealth = 300 + 6 * (0.65 * AssessedAccuracy + 0.35 * OverallReadiness)`
- This prevents high career score outputs for low-correct sessions (example: low raw correctness now yields lower score band).

3. Competitive fit guardrails (IIT/NEET/CAT/LAW)
- Fit indices are now calibrated against assessed accuracy.
- High fit values are capped/blended when raw accuracy is low, preventing unrealistic spikes.
- Explicitly treated as readiness-fit indicators, not predicted exam marks/ranks.

4. Missing subject-affinity handling fix
- When subject-affinity survey answers are absent, neutral baseline is used.
- Removed optimistic fallback behavior that previously inherited high aptitude/interest and inflated downstream fit.

5. Parent-authenticity evidence (question level)
- Added **Question-Level Score Audit** in result page.
- Shows question code, section, selected option, correct option, weight, earned/lost points, and correctness badge.
- This gives direct traceability for “which questions led to the score”.

6. New visual graphs on result page
- **Score Visual Breakdown** panel added with:
  - Assessed Accuracy donut graph
  - Correct vs Incorrect stacked bar
  - Career Score Composition bars (Accuracy 65%, Readiness 35%, Composite)
- Existing dashboards retained for stream fit, section performance, competency, and subject signals.

7. Scoring method disclosure
- Added scoring-method notes block in report to communicate:
  - assessed accuracy basis
  - career score composition
  - IIT/NEET/CAT interpretation limits
  - handling when subject-affinity inputs are missing

## Files Updated
- `src/main/java/com/robodynamics/controller/RDAptiPathStudentController.java`
- `src/main/webapp/WEB-INF/views/student/aptipath-result.jsp`

## Build Verification
- Maven package successful:
  - `mvn -s .m2/settings-local.xml clean package -DskipTests`
- Output WAR generated successfully in `target/`.

## Deployment Status
- Deployed to production Tomcat ROOT WAR.
- Service restart and active status verified.
