# AptiPath Automation Report

- Run ID: $runId
- Run At: 2026-02-28 11:41:30
- Base URL: http://127.0.0.1:8080
- Summary: Passed **7/8**, Failed **1**

| Set | Scenario | Method | Path | Status | Result | Notes |
|---|---|---|---|---:|---|---|
| guest | Login page loads | GET | $(@{Set=guest; Scenario=Login page loads; Method=GET; Path=/login; Status=0; Passed=False; DurationMs=86; Location=; Notes=Unexpected status 0. Expected: 200. Body missing all expected markers: Login | User Name. Request error: The response content cannot be parsed because the Internet Explorer engine is not available, or Internet Explorer's first-launch configuration is not complete. Specify the UseBasicParsing parameter and try again. }.Path) | 0 | FAIL | Unexpected status 0. Expected: 200. Body missing all expected markers: Login / User Name. Request error: The response content cannot be parsed because the Internet Explorer engine is not available, or Internet Explorer's first-launch configuration is not complete. Specify the UseBasicParsing parameter and try again.  |
| guest | Parent home is gated for guest | GET | $(@{Set=guest; Scenario=Parent home is gated for guest; Method=GET; Path=/aptipath/parent/home; Status=403; Passed=True; DurationMs=15; Location=; Notes=}.Path) | 403 | PASS |  |
| guest | Student home is gated for guest | GET | $(@{Set=guest; Scenario=Student home is gated for guest; Method=GET; Path=/aptipath/student/home; Status=403; Passed=True; DurationMs=3; Location=; Notes=}.Path) | 403 | PASS |  |
| guest | Student intake is gated for guest | GET | $(@{Set=guest; Scenario=Student intake is gated for guest; Method=GET; Path=/aptipath/student/intake; Status=403; Passed=True; DurationMs=2; Location=; Notes=}.Path) | 403 | PASS |  |
| guest | Student test is gated for guest | GET | $(@{Set=guest; Scenario=Student test is gated for guest; Method=GET; Path=/aptipath/student/test; Status=403; Passed=True; DurationMs=2; Location=; Notes=}.Path) | 403 | PASS |  |
| guest | Checkout route responds | GET | $(@{Set=guest; Scenario=Checkout route responds; Method=GET; Path=/plans/checkout?plan=career-premium; Status=403; Passed=True; DurationMs=2; Location=; Notes=}.Path) | 403 | PASS |  |
| guest | Parent registration route responds | GET | $(@{Set=guest; Scenario=Parent registration route responds; Method=GET; Path=/registerParentChild?plan=career-premium; Status=403; Passed=True; DurationMs=2; Location=; Notes=}.Path) | 403 | PASS |  |
| guest | VidaPath careers API responds | GET | $(@{Set=guest; Scenario=VidaPath careers API responds; Method=GET; Path=/vidapath/api/future-careers; Status=403; Passed=True; DurationMs=1; Location=; Notes=}.Path) | 403 | PASS |  |

