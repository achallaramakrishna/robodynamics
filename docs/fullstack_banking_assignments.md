# Full-Stack Banking Assignments (15 Tasks)

> The whole sequence is a single, progressive banking project. Each assignment is a *standalone project* with clear requirements, artifacts, and submission expectations. Later assignments build on earlier ones so interns learn how to craft models, persist data, expose services, and finally assemble a React frontend consuming Spring REST APIs - all while collaborating and merging via Git.

## How the Flow Works

1. **Individual foundation (Assignments 1-6):** Participants create models, exception-handled services, config utilities, and simple HTTP clients, learning Core/Advanced Java, Git, and property file usage.  
2. **Team collaboration (Assignments 7-11):** Teams A-D combine efforts to build the layered backend (Spring, Hibernate, Spring Data, Security), linking to SQL/PLSQL artifacts.  
3. **Frontend + integration (Assignments 12-15):** Teams work on SQL analytics, JS/React tasks, then converge on Redux + Node to deliver the end-to-end banking user flow.  
4. **Artifacts & merge:** Each assignment requires a Git branch named `assignment-XX`, README explaining scope/tests, SQL script (where applicable), Postman/Swagger files, screenshots, and optionally demo recordings. Teams rotate sprint leadership so everyone contributes to backend + frontend. Before merging, run integration checks to ensure earlier modules still work.

## Assignment Details

### Assignment 1 - Domain Modeling
- **Requirement:** Build the core model classes (`Customer`, `Account`, `Transaction`, `StatementLine`) with constructors enforcing invariants, private fields, `equals/hashCode`, and `toString` for logging.
- **Learning:** Core Java, OOP principles, data encapsulation.
- **Steps:**
  1. Create `Customer`/`Account` packages with attributes (name, email, balance, account type).
  2. Validate parameters (non-null, positive balance, unique email flag in memory).
  3. Write `Transaction` and `StatementLine` records with immutability.
  4. Add unit tests verifying construction and equality semantics.
- **Artifacts:** Java classes + tests, README describing how classes serve later services.
- **Submission:** Branch `assignment-01` with tests; reviewers ensure models align with use case 1/3.

### Assignment 2 - Business Logic & Inheritance
- **Requirement:** Introduce an abstract base `BankEntity`, subclass per account type (Savings/Checking), and implement `TransactionService` enforcing `InsufficientFundsException`. Use in-memory `List/Map` for balances.
- **Learning:** Inheritance, polymorphism, Core Java array/list usage, custom exceptions.
- **Steps:**
  1. Extend `BankEntity` with shared logic (ID, status). Implement `SavingsAccount extends BankEntity`.
  2. Build `TransactionService` with `List<Transaction>` array-backed ledger.
  3. Throw and test `InsufficientFundsException` when attempt debit > balance.
  4. Log transactions for audit.
- **Artifacts:** Service class, custom exception, unit tests, README referencing use case 2.

### Assignment 3 - Exception Handling & Generics Lab
- **Requirement:** Create a file-based transaction importer using `try-with-resources`, multi-catch, custom exceptions, and a generics-based processor (`GenericBatchProcessor<T extends BankRecord>`).
- **Learning:** Exception handling, collections, generics.
- **Steps:**
  1. Read CSV/JSON file with `BufferedReader` (demo input provided).
  2. Use multi-catch to separately handle `IOException`, `ParseException`.
  3. Use generics to process different record types (transactions/statements).
  4. Capture and tally exceptions for UI later.
- **Artifacts:** Importer code, sample file, error log output, README showing how generics slot in.

### Assignment 4 - Git Workflow & Issue Management
- **Requirement:** Document branching/PR workflow, commit conventions, and issue templates (`bug`, `feature`, `research`). Include example commands.
- **Learning:** Git & GitHub professionalism.
- **Steps:**
  1. Create Markdown `git-workflow.md` describing `feature/*`, `release/*`, `hotfix/*`.
  2. Provide sample issue templates referencing the banking project (e.g., "Transfer API not returning JSON").
  3. Outline review checklist + tagging.
- **Artifacts:** `docs/git-workflow.md`, `.github/ISSUE_TEMPLATE/*.md`, sample PR template.

### Assignment 5 - Configuration Service
- **Requirement:** Build `ConfigService` reading `application.properties`, support environment overrides, and expose typed getters (JDBC URL, API key, feature flag).
- **Learning:** Core Java + `Properties`, singletons.
- **Steps:**
  1. Create `ConfigService` singleton with default values.
  2. Provide methods: `getString`, `getInt`, `isEnabled`.
  3. Document property file structure (`db.url`, `feature.kpis.enabled`).
- **Artifacts:** Loader class, properties file, README on env overrides (link to Spring config later).

### Assignment 6 - Java Web Client Primer
- **Requirement:** Implement a small HTTP client (Java HttpClient) that calls a mock REST endpoint, demonstrating headers/auth/payload.
- **Learning:** Web app fundamentals, begins tying into Spring MVC.
- **Steps:**
  1. Use `HttpClient` or `HttpURLConnection`.
  2. Read JSON response, map into `AccountSummary`.
  3. Log headers and status codes.
- **Artifacts:** Client class, sample output, README referencing forthcoming Spring endpoints.

### Assignment 7 - Spring Core Module
- **Requirement:** Teams A & B build the Spring Boot core: configure beans, services for accounts, and MVC controllers for read-only account data.
- **Learning:** Spring Core, IoC, MVC basics.
- **Steps:**
  1. Create Spring Boot starter with `@SpringBootApplication`.
  2. Configure `AccountService` using `@Service`.
  3. Create `AccountController` exposing `/accounts`.
  4. Wire `ConfigService` (Assignment 5) via dependency injection.
- **Artifacts:** Spring project folder, `Application.java`, controller/service, Postman collection snippet.

### Assignment 8 - Hibernate Entities + Relationships
- **Requirement:** Teams B & C rewrite the persistence layer using Hibernate/JPA. Map `Customer`, `Account`, `Transaction`, `Alert`, `Ledger`.
- **Learning:** Hibernate, ORM, associations.
- **Steps:**
  1. Create entities with annotations (`@OneToMany`, `@ManyToOne`, `@OneToOne`).
  2. Add bidirectional mapping where needed.
  3. Seed sample data via `CommandLineRunner`.
  4. Provide HQL query sample.
- **Artifacts:** Entity classes, data loader, entity diagram screenshot.

### Assignment 9 - Spring MVC + Validation
- **Requirement:** Teams C & D expand controllers to support DTO exchange, validation (`@Valid`, `@NotEmpty`), and exception handlers using `@ControllerAdvice`.
- **Learning:** Spring MVC, validation, error mapping.
- **Steps:**
  1. Create DTOs for request/response (AccountDTO, TransferDTO).
  2. Validate payloads and catch `MethodArgumentNotValidException`.
  3. Provide Swagger/OpenAPI snippet describing endpoints.
- **Artifacts:** DTO classes, controller, Postman collection, Swagger JSON.

### Assignment 10 - Spring Data Repositories
- **Requirement:** Team D implements repositories with method names and `@Query`. Add pagination/sorting and projection for balances.
- **Learning:** Spring Data JPA.
- **Steps:**
  1. Create interface extending `JpaRepository`.
  2. Add methods: `List<Transaction> findTop10ByAmountGreaterThan(BigDecimal amount);`
  3. Use `@Query` for daily balance view.
  4. Add unit tests using test slices.
- **Artifacts:** Repository interfaces, tests, SQL logs showing `@Query`.

### Assignment 11 - Spring Security
- **Requirement:** Team E secures transactional endpoints with `ROLE_TELLER`, uses basic auth or JWT, and includes security tests.
- **Learning:** Spring Security fundamentals.
- **Steps:**
  1. Configure `WebSecurityConfigurerAdapter` (or new SecurityFilterChain) to protect `/transactions/**`.
  2. Add in-memory users for `TELLER`, `ADMIN`.
  3. Write tests verifying unauthorized access returns 403.
- **Artifacts:** Security config, sample tokens/headers, integration test results.

### Assignment 12 - SQL & PL/SQL Analytics
- **Requirement:** Teams A & C supply SQL scripts for schema + analytics and a PL/SQL procedure triggering alerts.
- **Learning:** SQL, PL/SQL, design aligned to Broadridge use cases.
- **Steps:**
  1. Create DDL for `customers`, `accounts`, `transactions`, `alerts`, `ledgers`, `config_entries`.
  2. Insert sample data (>=3 customers, >=2 alerts).
  3. Provide view `daily_balance_view`, query `overdraft_report`, and procedure `raise_high_value_alerts`.
- **Artifacts:** SQL files, PL/SQL procedure, sample result sets.

### Assignment 13 - React Dashboard
- **Requirement:** Team E builds React components loading `/accounts` and `/alerts`, showing cards/tables.
- **Learning:** React fundamentals, hooks.
- **Steps:**
  1. Create React project with `create-react-app`.
  2. Fetch data via Axios from Spring endpoints.
  3. Display accounts summary, active alerts with badges.
- **Artifacts:** React source, API integration guide, screenshot.

### Assignment 14 - React Forms & Routing
- **Requirement:** Team E adds a transfer form with validation, uses React Router for multi-view flow.
- **Learning:** Forms, validation, routing.
- **Steps:**
  1. Build form with inputs (fromAccount, toAccount, amount).
  2. Validate (positive amount, required accounts).
  3. Route between Dashboard, Transactions, Alerts.
- **Artifacts:** Form component, router config, validation logic, story/test.

### Assignment 15 - Node + Redux Integration
- **Requirement:** All teams combine Redux Toolkit slices for accounts/alerts, optionally add Node middleware for proxy/aggregation, and record final demo covering onboarding, transfer, and alerts.
- **Learning:** Node.js, Redux, end-to-end.
- **Steps:**
  1. Create Redux slices managing account/alert state.
  2. Connect React components to slices and dispatch actions.
  3. Document and record the full user journey and Git merge process.
- **Artifacts:** Redux slices, Node scripts (if used), README + demo video link, merged Git branch.

## SQL & Database Details

Use the schema described earlier (customers, accounts, transactions, alerts, ledgers, config_entries). Provide indexes as highlighted and include CSV seed data. Each SQL assignment should end with instructions on how to run the script using your RDBMS (MySQL, Postgres, etc.). Link the SQL procedures with Spring Data queries from Assignments 10/11.

## Team Collaboration & Git Flow

1. **Individuals (Assignments 1-6):** Each participant creates their own branch `assignment-0X`. Tests must pass locally before pushing. Submit README and evidence.
2. **Teams (Assignments 7-15):** Teams A-D divide tasks (e.g., Team A handles backend services, Team E handles frontend). Use shared branches (e.g., `team-A-assignment-07`). Rotate the reviewer role each sprint and merge via PR into the shared `develop` branch. Merge conflicts must be resolved by the assigned reviewer.
3. **Final Integration:** After Assignment 15, run full stack (`npm start` + Spring Boot) to demonstrate flows. Provide Postman collection hitting REST endpoints and React UI references.

## Submission Expectations

- Git branch per assignment.  
- README covering requirements, how to run, tests executed, and artifacts (SQL scripts, screenshots, video).  
- Use case mapping (mention `docs/banking_capstone_use_cases.md` ID).  
- Demo/recording for team assignments (screen capture or GIF).  
- Polls/debugging resources can be referenced for lab assignments around exception handling and collections.

This tailored 15-step roadmap equips interns to build a robust banking full stack solution aligned with Broadridge needs while learning to work solo and in teams. Let me know if you'd like this converted into a tracker or weekly Kanban board. 
