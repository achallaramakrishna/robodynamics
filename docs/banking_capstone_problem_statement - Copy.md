## Banking Capstone Problem Statement

RoboDynamics runs a modern banking training program where learners must go beyond tutorials and build a production-like Java Full Stack solution over 30 days. The goal of the capstone is to **simulate a Broadridge-style retail banking system** that captures the entire lifecycle-from modeling customers and accounts, through RESTful services, to a polished React frontend and analytical SQL. Participants experience the full stack while working individually and as small teams, so they understand both the technology and the collaborative process.

### High-Level Context

- **Domain:** Retail banking with customers, accounts, transactions, alerts, ledgers, and compliance reporting.
- **Scope:** Every assignment builds toward a single banking application that includes login/signup flows, transaction processing, alerts, reporting, and dashboards.
- **Modules covered:**  
  1. Core Java fundamentals (classes, validation, business rules).  
  2. Advanced Java (exceptions, collections, generics, configuration).  
  3. Web application basics (HTTP clients, JDBC, servlets/JSP).  
  4. Hibernate/JPA (relationship mapping, HQL).  
  5. Spring Core/MVC/Security/Data (dependency injection, REST, security, data layers).  
  6. SQL & PL/SQL for schema, analytics, stored procedures.  
  7. JavaScript, Node.js, React/Redux (frontend consumption + orchestration).  
  8. Git/GitHub professionalism (branching, PRs, issue templates, merging).

### The Problem Participants Solve

**RoboDynamics Banking Flow:**  
1. **Onboard customers** with clean data models, ensuring validations (unique emails, account types).  
2. **Process transactions** while enforcing rules (`InsufficientFundsException`), tracking operations in-memory before moving to persistence.  
3. **Monitor exceptions** and config changes, preparing teams to respond quickly to failures.  
4. **Persist and query data** through JDBC first (DAO layer) then migrate to Hibernate and Spring Data.  
5. **Provide RESTful services** (Spring MVC + Spring REST) delivering account data, transfer endpoints, and alerts, secured so that only `ROLE_TELLER` users can mutate data.  
6. **Build SQL/PLSQL analytics** for balances, overdraft detection, and alerts.  
7. **Deliver a React dashboard** with forms, validation, routing, and Redux-driven state, consuming the Spring REST APIs.  
8. **Run the complete stack**: Spring backend + React frontend + SQL backend with Postman/Swagger coverage and code reviews via Git.

Each assignment in `docs/fullstack_banking_assignments.md` is one building block in this flow. They start with individual efforts (modeling, business logic, exception handling, Git/config), then shift to teams composing the backend layers and SQL artifacts, and finish with frontend integration + Redux + demonstration of the whole flow.

### Expected Workflow

1. **Individual work (Assignments 1-6):** Every participant practices writing Java classes, services, exception handling, config loaders, and simple HTTP clients while learning Git & documentation. These assignments simulate the early production work before teams form.
2. **Team sprint (Assignments 7-11):** Teams A-D split backend responsibilities (Spring Core, Hibernate, Spring MVC, Spring Data, Security). Each team keeps branches like `team-A-assignment-07`, merges via PRs, and rotates reviewers to experience code reviews.
3. **SQL/PLSQL assignment (12):** Teams collaborate to design the schema, load data, and create stored procedures (e.g., `raise_high_value_alerts`).
4. **JavaScript/Node/React (13-15):** Team E (or mixed) delivers the UI/UX-dashboard, forms, state management, and demos. React hooks + Redux slices call Spring endpoints validated earlier.
5. **Integration & Demo:** After Assignment 15, all code is merged, the stack (Spring Boot + React + SQL) must run, and teams submit demos/README per assignment.

### Practical Deliverables per Assignment

For every assignment participants must provide:  
- **Code** (Java, SQL, React, Node, etc.)  
- **Tests** (JUnit, integration, Postman collections)  
- **Documentation** (README describing goal, steps, commands, dependencies).  
- **Artifacts** (SQL scripts, Swagger JSON, screenshots, demo video).  
- **Git proof** (branch name `assignment-XX`, issue/PR references, merge notes).

### How the Assignments Connect

1. The model classes from Assignment 1 feed into services in Assignments 2-3 and into Hibernate entities later.  
2. Spring Core beans (Assignment 7) use the same `ConfigService` (Assignment 5).  
3. The SQL schema and stored procedure from Assignment 12 are referenced by Spring Data repositories (Assignments 10/11).  
4. React components (Assignments 13-15) call Spring REST endpoints that were created from Assignments 9-11.  
5. Exception metrics (Assignment 3) become part of Spring endpoints (Assignment 12) that feed the React dashboard (Assignment 15).  

### Team Structure Recommendation

- Form five teams (A-E) with four participants each.  
- Each person completes Assignments 1-6 individually.  
- For team assignments, rotate leadership and reviewers so each participant:  
  - Gets backend exposure (Spring, Hibernate).  
  - Participates in SQL, REST, and frontend work.  
  - Practices merging via Git in shared branches.  
- Encourage teams to create daily stand-ups, shared Kanban boards, and assign responsibilities (e.g., Team A handles schema + alerts, Team E owns React UI).

### Final Outcome

By the end of the 15 assignments, participants will have delivered:  
- Robust domain models.  
- Business logic enforcing banking rules.  
- JDBC/DAO and Hibernate persistence layers.  
- Spring REST APIs with validation/security.  
- Analytical SQL queries and PL/SQL alerts.  
- React dashboard + forms + Redux-driven state.  
- CI-friendly Git history with documentation and demos.  

This narrative should help participants grasp the "why" behind each assignment, understand how their work fits into the growing banking project, and ensure the final deliverable is a coherent, full-stack solution with strong domain relevance. Let me know if you'd like this turned into a printable brochure or included on your LMS page. 
