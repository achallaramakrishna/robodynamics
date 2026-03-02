# AptiPath Automation Report

- Run ID: 20260228_114313
- Run At: 2026-02-28 11:43:13
- Base URL: http://127.0.0.1:8085/robodynamics
- Summary: Passed **8/8**, Failed **0**

| Set | Scenario | Method | Path | Status | Result | Notes |
|---|---|---|---|---:|---|---|
| guest | Login page loads | GET | /login | 200 | PASS |  |
| guest | Parent home is gated for guest | GET | /aptipath/parent/home | 302 | PASS |  |
| guest | Student home is gated for guest | GET | /aptipath/student/home | 302 | PASS |  |
| guest | Student intake is gated for guest | GET | /aptipath/student/intake | 302 | PASS |  |
| guest | Student test is gated for guest | GET | /aptipath/student/test | 302 | PASS |  |
| guest | Checkout route responds | GET | /plans/checkout?plan=career-premium | 302 | PASS |  |
| guest | Parent registration route responds | GET | /registerParentChild?plan=career-premium | 200 | PASS |  |
| guest | VidaPath careers API responds | GET | /vidapath/api/future-careers | 200 | PASS |  |

