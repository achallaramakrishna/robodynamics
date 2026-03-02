# AptiPath Automation Report

- Run ID: 20260228_114158
- Run At: 2026-02-28 11:41:58
- Base URL: http://127.0.0.1:8080
- Summary: Passed **7/8**, Failed **1**

| Set | Scenario | Method | Path | Status | Result | Notes |
|---|---|---|---|---:|---|---|
| guest | Login page loads | GET | /login | 200 | FAIL | Body missing all expected markers: Login / User Name. |
| guest | Parent home is gated for guest | GET | /aptipath/parent/home | 403 | PASS |  |
| guest | Student home is gated for guest | GET | /aptipath/student/home | 403 | PASS |  |
| guest | Student intake is gated for guest | GET | /aptipath/student/intake | 403 | PASS |  |
| guest | Student test is gated for guest | GET | /aptipath/student/test | 403 | PASS |  |
| guest | Checkout route responds | GET | /plans/checkout?plan=career-premium | 403 | PASS |  |
| guest | Parent registration route responds | GET | /registerParentChild?plan=career-premium | 403 | PASS |  |
| guest | VidaPath careers API responds | GET | /vidapath/api/future-careers | 403 | PASS |  |

