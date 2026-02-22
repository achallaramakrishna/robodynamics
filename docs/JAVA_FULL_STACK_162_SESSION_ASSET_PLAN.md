# Java Full Stack Course 162 - Session Asset Plan

## 1) Lab Manual Quality Standard (mandatory for every labmanual HTML)

Reference style:
- `docs/session_34_spring-core-lab01.html`
- `docs/session34_lab2_ioc_xml_configuration.html`

Every lab manual should include:
1. Introduction and objective
2. Prerequisites and setup checks
3. Concept section (why this lab matters)
4. Step-by-step instructions (numbered)
5. Toggleable code blocks with copy button
6. Expected output screenshot/text block
7. Execution flow (how components interact)
8. Common errors and fixes
9. Reflection/checkpoint questions
10. Optional challenge extension

## 2) Asset Row Standard per Session

For `rd_course_session_details` (types only requested):
- `flashcard = 1`
- `matchinggame = 1`
- `matchingpair = 1`
- `quiz = 1`
- `exampaper = 1`
- `labmanual = 4`

Target rows per session: `9`

## 3) Current Production Snapshot (course_id=162)

Current session count: `30`

Current type totals:
- `flashcard = 36`
- `matchinggame = 30`
- `matchingpair = 30`
- `quiz = 30`
- `exampaper = 30`
- `labmanual = 36`

Observation:
- Sessions `2669` has extra rows (`flashcard=7`, `labmanual=7`).
- Sessions `2670` to `2698` have `1` row per type and only `1` labmanual.

## 4) Session-by-Session Plan

Standard target for each session:
- `F/MG/MP/Q/E/L = 1/1/1/1/1/4`

Session list:
1. `2669` Day 1 - Introduction to Java and Language Fundamentals
2. `2670` Day 2 - OOP: Classes, Inheritance and Polymorphism
3. `2671` Day 3 - Exception Handling, Collections and Generics
4. `2672` Day 4 - Git and GitHub: Version Control for Professional Developers
5. `2673` Day 5 - JUnit 5: Test-Driven Development
6. `2674` Day 6 - Relational Model and Core SQL
7. `2675` Day 7 - Advanced SQL: JOINs, DDL and Constraints
8. `2676` Day 8 - Advanced Querying and Performance Basics
9. `2677` Day 9 - PL/SQL Fundamentals
10. `2678` Day 10 - ORM Concepts and JPA Introduction
11. `2679` Day 11 - JPA: Entity Lifecycle, Relationships and Querying
12. `2680` Day 12 - Spring Core: DI, IoC and Spring MVC
13. `2681` Day 13 - Spring Boot: Getting Started and Auto-Configuration
14. `2682` Day 14 - Building RESTful APIs with Spring Boot
15. `2683` Day 15 - Spring Data JPA: Repositories and Query Methods
16. `2684` Day 16 - Spring Data REST, Validation and API Documentation
17. `2685` Day 17 - Spring Security: Authentication and JWT Authorization
18. `2686` Day 18 - Modern JavaScript (ES6+) Fundamentals
19. `2687` Day 19 - Ajax, REST Consumption and Node.js/npm Basics
20. `2688` Day 20 - React Fundamentals: Components, JSX and Props
21. `2689` Day 21 - React: State Management with Hooks and Context API
22. `2690` Day 22 - React: Forms, Validation and React Router
23. `2691` Day 23 - Advanced React: Redux Toolkit and API Integration
24. `2692` Day 24 - React: Styling, UI Libraries and Performance
25. `2693` Day 25 - Full-Stack Integration and End-to-End Testing
26. `2694` Day 26 - Jenkins: CI/CD Pipelines
27. `2695` Day 27 - Docker: Containerizing Your Applications
28. `2696` Day 28 - Cloud Deployment: AWS / Render / Railway
29. `2697` Day 29 - Capstone Project Day 1: Design and Backend
30. `2698` Day 30 - Capstone Project Day 2: Frontend, Docker and Live Demo

Delta execution:
- Session `2669`: normalize to standard (recommended: keep best 1 flashcard + best 4 labmanual and archive/remove extras).
- Sessions `2670` to `2698`: add `+3 labmanual` each.

If strict standardization is applied:
- Additions: `29 * 3 = 87` new `labmanual` rows
- Cleanup at session `2669`: remove/retire `6 flashcard + 3 labmanual = 9` rows
- Net change: `+78` rows
- Final total rows for these 6 asset types: `270`

If no cleanup is applied:
- Additions: `+87` rows
- Final total rows for these 6 asset types: `279` (non-uniform but safe)

## 5) Lab Manual Pack per Session (4 manuals each)

For every session, publish these 4 manuals:
1. `Lab 1 - Guided Build`
2. `Lab 2 - Core Implementation`
3. `Lab 3 - Troubleshooting and Debugging`
4. `Lab 4 - Challenge and Extension`

Naming pattern recommendation:
- `session_<session_no>_lab01_<slug>.html`
- `session_<session_no>_lab02_<slug>.html`
- `session_<session_no>_lab03_<slug>.html`
- `session_<session_no>_lab04_<slug>.html`

