# AptiPath Automation Runbook

## Purpose
This automation validates AptiPath core journey behavior across guest and authenticated scenarios, and produces machine-readable + human-readable reports.

## Script
`scripts/aptipath_scenario_automation.ps1`

## What It Tests
1. Login page availability.
2. Guest gating for protected AptiPath routes.
3. Checkout and registration route availability.
4. VidaPath API route availability.
5. Optional authenticated parent scenarios (if credentials are provided).
6. Optional authenticated student scenarios (if credentials are provided).

## Output
For each run, two files are written to `artifacts/aptipath-automation/`:
1. `aptipath_automation_<timestamp>.json`
2. `aptipath_automation_<timestamp>.md`

## Run Examples
1. Guest-only smoke run:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/aptipath_scenario_automation.ps1 -BaseUrl http://127.0.0.1:8085/robodynamics
```

2. Parent + student authenticated run:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/aptipath_scenario_automation.ps1 `
  -BaseUrl http://127.0.0.1:8085/robodynamics `
  -ParentUser "<parent_user>" -ParentPassword "<parent_password>" `
  -StudentUser "<student_user>" -StudentPassword "<student_password>"
```

## Interpreting Results
1. `Passed` means route behavior matched expected status/gating/content checks.
2. `Failed` means status, gating, or content assertion failed.
3. The script returns process exit code `1` if any scenario fails, so it can be plugged into CI/CD gates.

## OpenAI Usage Recommendation for AptiPath Reports
Use **2-4 calls per student journey**:
1. Pre-final insight extraction.
2. Final report generation.
3. Optional validation pass.
4. Optional parent-summary generation.

Avoid per-question model calls during the adaptive test.
