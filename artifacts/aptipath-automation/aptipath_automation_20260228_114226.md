# AptiPath Automation Report

- Run ID: 20260228_114226
- Run At: 2026-02-28 11:42:26
- Base URL: http://127.0.0.1:8085/robodynamics
- Summary: Passed **3/8**, Failed **5**

| Set | Scenario | Method | Path | Status | Result | Notes |
|---|---|---|---|---:|---|---|
| guest | Login page loads | GET | /login | 200 | PASS |  |
| guest | Parent home is gated for guest | GET | /aptipath/parent/home | 0 | FAIL | Unexpected status 0. Expected: 302,303,401,403. Route is not login-gated as expected. Request error: Operation is not valid due to the current state of the object. |
| guest | Student home is gated for guest | GET | /aptipath/student/home | 0 | FAIL | Unexpected status 0. Expected: 302,303,401,403. Route is not login-gated as expected. Request error: Operation is not valid due to the current state of the object. |
| guest | Student intake is gated for guest | GET | /aptipath/student/intake | 0 | FAIL | Unexpected status 0. Expected: 302,303,401,403. Route is not login-gated as expected. Request error: Operation is not valid due to the current state of the object. |
| guest | Student test is gated for guest | GET | /aptipath/student/test | 0 | FAIL | Unexpected status 0. Expected: 302,303,401,403. Route is not login-gated as expected. Request error: Operation is not valid due to the current state of the object. |
| guest | Checkout route responds | GET | /plans/checkout?plan=career-premium | 0 | FAIL | Unexpected status 0. Expected: 200,302,303,401,403. Request error: Operation is not valid due to the current state of the object. |
| guest | Parent registration route responds | GET | /registerParentChild?plan=career-premium | 200 | PASS |  |
| guest | VidaPath careers API responds | GET | /vidapath/api/future-careers | 200 | PASS |  |

