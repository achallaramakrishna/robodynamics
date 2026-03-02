# Intern Project Assignments - Banking Full Stack

All interns enrolled in the 30-day Java Full Stack track must complete the following **project-based assignments**. Each assignment is a deliberate slice of a Broadridge-style banking workflow so students gain exposure to modeling, backend APIs, persistence, testing, and frontend integration before graduation. Submit every assignment as a Git branch, include README notes on how to run or query the delivered feature, and track any SQL scripts or tests that accompany it.

| Assignment | Delivery Focus | Learning Outcomes |
|------------|----------------|------------------|
| **1. Account Onboarding CLI** | Java CLI + Collections | Model `Customer`/`Account` classes and use collections to store onboarding data. |
| **2. Transaction Balance Checker** | Exception handling + JUnit | Throw `InsufficientFundsException` for debit overshoots, write unit tests for happy and failure paths. |
| **3. Customer Statement Generator** | Sorting + Reporting | Create immutable statement records, sort by timestamp, and format totals for a pseudo monthly report. |
| **4. Git-Based Code Review Workflow** | Git/GitHub | Author documentation showing branch/PR conventions, commit message format, and review checklist for banking features. |
| **5. BankOperation Interface Suite** | Interfaces + Polymorphism | Implement multiple banking operations (`FundTransfer`, `BillPayment`) and register them with a batch executor. |
| **6. Exception Observation Dashboard** | Logging + Collections | Capture exceptions during processing, tally by type, and expose a small HTML dashboard summarizing counts. |
| **7. Generics-Based Cache** | Generics + Concurrency | Build `GenericCache<K,V>` enforcing `V extends Cacheable`, with safe `putIfAbsent` and `computeIfPresent`. |
| **8. Config Loader** | Properties + Singleton | Load properties (DB creds, API keys) with defaults, allow overrides via env vars, expose values through a singleton. |
| **9. SQL Schema for Ledger** | DDL + Constraints | Design accounts/transactions tables with PK/FK, add indexes, and provide seed inserts demonstrating integrity. |
| **10. JOIN Balance Report** | Advanced SQL | Join accounts and transactions to compute daily balances and mark overdrafts in an analytical view. |
| **11. PL/SQL Alert Procedure** | PL/SQL | Create a stored procedure that scans the ledger for transfers >10k and writes alerts. |
| **12. JPA Entities & Relationships** | ORM | Model `Customer`, `Account`, `Transaction` with JPA annotations and seed data via `CommandLineRunner`. |
| **13. Spring Boot REST API** | Spring MVC + Validation | Expose `/accounts`, `/transactions`, `/alerts`, use DTOs, validate inputs, and return structured errors. |
| **14. Spring Data JPA Queries** | Repositories | Add repository methods (method names and `@Query`) for finding high-value transactions and running balance projections. |
| **15. Spring Security Layer** | Security | Secure endpoints, restrict transaction creation to `ROLE_TELLER`, provide tests for authorized/unauthorized flows. |
| **16. React Banking Dashboard** | React + Hooks | Build a UI that fetches accounts/transactions, renders balances, and highlights alerts. |
| **17. React Transfer Form** | Forms + Validation | Implement a transfer form with router navigation and inline validations for required fields and positive amounts. |
| **18. Redux Toolkit Alerts** | State Management | Store accounts/alerts in Redux slices; connect a component to show live alert counts. |
| **19. End-to-End Story Flow** | Integration | Document the full flow from onboarding through alert generation in text or diagrams. |
| **20. JUnit 5 Test Suite** | Testing Culture | Write nested/parameterized tests around service logic, covering success, exceptions, and boundary inputs. |
| **21. GitHub Issue Templates** | Process | Create `bug`, `feature`, and `research` templates plus guidance on linking issues to code. |


## Execution Notes

- Pair the backend + frontend tasks when possible; e.g., complete the Spring Boot API before wiring the React dashboard.
- Every assignment should include sample data or scripts so QA can replay the banking flow (e.g., sample JSON for REST calls, SQL scripts for views or alerts).
- Use the earlier polling/debugging resources to rehearse the tricky portions (multi-catch, comparator chaining, exception visibility).
- Track progress in a shared Kanban board (To Do, In Progress, Review, Done) and move assignments through the board before merging to `main`.

Finishing all 21 assignments gives students a production-like experience spanning Core Java, Git, JPA, Spring, testing, and React for banking systems. Provide demo videos or README walkthroughs for the earning of completion credit. Let me know if you want a printable PDF version as well. 
