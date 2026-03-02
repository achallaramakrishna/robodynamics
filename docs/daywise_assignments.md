# Day-Wise Assignments for the 30-Day Java Full Stack Track

This plan is aligned with the **Banking Capstone Use Cases** (`docs/banking_capstone_use_cases.md`) and the **Java Full Stack Course Outline With Labs** (`docs/Java_Full_Stack_Course_Outline_With_Labs.docx`). Each assignment is tied to the daily session topics, builds toward the single banking project, and alternates between **individual** work and **Team A-D** collaboration. Participants must submit per the dates listed below so reviewers can gauge progress and provide feedback before the final demo.

| Assignment | Coverage | Scope & Deliverables | Type | Submission Date |
| --- | --- | --- | --- | --- |
| 1. Domain Modeling Sprint | Day 1-2, Introduction to Java & Language Fundamentals | Implement `Customer`, `Account`, `Transaction`, and `StatementLine` classes with constructors, validation logic, and `equals/hashCode`. Document how these model the use cases "Register Customer & Account" and "Persist via JPA." | Individual | Feb 25, 2026 |
| 2. Transaction Rule Validator | Day 3-4, OOP: Classes, Inheritance & Polymorphism | Build `TransactionService` that throws `InsufficientFundsException` for overdrafts, with JUnit 5 nested/parameterized tests covering success/failure. Link to Use Case 2. | Individual | Feb 27, 2026 |
| 3. Statement Generator | Day 5-6, Exception Handling | Create a service that sorts transactions, groups by type, and produces formatted statements for use case 3. Include sample output files or console renderings. | Individual | Mar 1, 2026 |
| 4. Git Workflow & Issue Templates | Day 7, Git & GitHub | Draft the team's branching strategy, commit rules, PR checklist, and issue templates (bug/feature/research). Capture commands and references to Use Case 4. | Individual | Mar 2, 2026 |
| 5. Operation Interfaces + Cache | Day 8-9, Core Java + Static Concepts | Define `BankOperation` interface (authorize/execute) and implementations plus a thread-safe `GenericCache<K,V extends Cacheable>`. Demonstrate usage within the service layer (Use Case 5). | Individual | Mar 4, 2026 |
| 6. Config Loader & Exception Monitoring | Day 10, Properties + Logging | Build a singleton loader that reads `application.properties`/env overrides and an exception tallying module with HTML report (Use Case 6). | Individual | Mar 6, 2026 |
| 7. Schema & Seed Data | Day 11-12, Relational Model & Core SQL | Teams A-D coordinate to deliver SQL DDL for `customers`, `accounts`, `transactions`, `alerts`, `ledgers` plus seed data. Ensure PK/FK and index coverage from Use Case 7. | Team | Mar 9, 2026 |
| 8. Analytical SQL + PL/SQL Alerts | Day 13-14, Advanced SQL + PL/SQL | Develop JOIN reports for balances/overdrafts and `raise_high_value_alerts` procedure. Link results to Use Case 8; provide execution scripts. | Team | Mar 12, 2026 |
| 9. JPA Entities & Relationships | Day 15-17, ORM & JPA Introduction | Map schema to entities, configure relationships, and seed data via `CommandLineRunner` to satisfy Use Case 9. Submit entity diagrams/docs. | Team | Mar 15, 2026 |
| 10. Spring REST API | Day 18-20, Spring Core & MVC | Create controllers for `/accounts`, `/transactions`, `/alerts` with DTOs, validation, and exception handling referencing Use Case 10. Include Postman/Swagger samples. | Team | Mar 18, 2026 |
| 11. Spring Data + Security | Day 21-22, Spring Boot & Security | Add repository methods (`@Query`, named queries) for high-value transactions/balances. Secure writes to `ROLE_TELLER` and provide integration tests (Use Case 11). | Team | Mar 21, 2026 |
| 12. Exception Metrics Endpoint | Day 23, Spring Data REST & Validation | Integrate exception-monitoring module into Spring and expose an HTML/REST endpoint showing counts (Use Case 12). Provide screenshot or HTTP sample response. | Team | Mar 23, 2026 |
| 13. React Dashboard | Day 24-25, Modern JavaScript & React Fundamentals | Build React UI fetching REST endpoints to display balances/alerts; include hooks and error handling (Use Case 13). Provide static mock + live data view. | Team | Mar 26, 2026 |
| 14. React Forms & Validation | Day 26-27, Forms, Validation & React Router | Implement a transfer form with inline validation, React Router navigation, and API submission (Use Case 14). Include form state unit test or storybook entry. | Team | Mar 28, 2026 |
| 15. Redux Story & Demo | Day 28-30, Redux Toolkit & End-to-End Testing | Manage accounts + alerts via Redux slices, capture flow narrative (Use Case 15), and submit README + demo video illustrating onboarding->transfer->alert loop. | Team | Apr 1, 2026 |

**Submission Process**

- Individuals push to `feature/assignment-{n}` branches with README/test screenshots for assignments 1-6.  
- Teams coordinate in shared repos/branches for assignments 7-15, include SQL scripts, Postman/Swagger exports, React builds, and demo recordings.  
- Reviewers assess against the **use case specifications** (e.g., documented flows, exception metrics) before approving merges.

**Notes**

- Dates align with the 23 Feb - 6 Apr 2026 training window; use these deadlines for weekly reviews.  
- Team A-D rotate leadership for each team assignment to ensure all members experience backend, database, and frontend work.  
- Polls/debugging resources (e.g., `docs/day3_polls_full.html`, `docs/day3_debugging_challenge.html`) can be referenced for labs around Exception/Collection topics.  
- If any assignment requires additional time, notify instructors by the related submission date so accommodations can be planned.
