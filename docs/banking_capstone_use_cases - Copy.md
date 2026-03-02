# Banking Capstone Use Cases

This document clarifies the **actors**, **use cases**, and **use case specifications** for the 15-step banking capstone project delivered by Teams A-E. Each use case maps to project requirements so interns understand what to build, why, and who benefits.

## Actors

| Actor | Role |
| --- | --- |
| Customer | Retail client who owns accounts and initiates transfers. |
| Teller | Internal banking user who approves/executes transactions. |
| Compliance Officer | Monitors large transfers and exception spikes. |
| System Integration | External services providing configuration, alerts, and reporting feeds. |
| Developer/Reviewer | Intern contributing code, running tests, and submitting reviews. |

## Use Case List

1. Register Customer & Account  
2. Perform Debit/Credit Transaction  
3. Generate Monthly Statement  
4. Manage Feature Branch & Review Workflow  
5. Execute Bank Operations (Transfer, Bill Pay)  
6. Monitor Exceptions & Config Changes  
7. Maintain Ledger Schema with Constraints  
8. Run Balance Analytics & Alert Procedure  
9. Persist Entities via JPA  
10. GET/POST Accounts & Transactions API  
11. Query Repositories + Enforce Security  
12. Surface Exception Metrics via Web  
13. Display React Dashboard (balances + alerts)  
14. Submit Transfer via React Form  
15. Redux State + End-to-End Demo  

## Use Case Specifications

### Use Case 1 - Register Customer & Account
- **Primary Actor:** Developer/Customer  
- **Description:** Capture customer demographics and open a primary account; required for onboarding.  
- **Preconditions:** Valid customer info and unique email.  
- **Trigger:** Customer submits onboarding form or CLI command.  
- **Main Flow:**  
  1. Collect personal details and address.  
  2. Instantiate `Customer` and `Account` domain objects with validations.  
  3. Persist into in-memory structure or database stub.  
  4. Return confirmation including account ID.  
- **Alternate Flow:** Duplicate email -> reject with validation error.  
- **Postconditions:** New customer/account exists; baseline data for transactions.

### Use Case 2 - Perform Debit/Credit Transaction
- **Primary Actor:** Teller  
- **Description:** Apply debits/credits while enforcing insufficient funds and logging outcomes.  
- **Preconditions:** Account exists and has a balance.  
- **Trigger:** Teller initiates a transfer or deposit.  
- **Main Flow:**  
  1. Teller submits transaction details to `TransactionService`.  
  2. Service compares amount with balance.  
  3. If valid, update balance, store transaction record.  
  4. Return updated balance or receipt.  
- **Alternate Flow:** Insufficient funds -> throw `InsufficientFundsException`; log exception.  
- **Postconditions:** Account balance updated; exception count increments if needed.

### Use Case 3 - Generate Monthly Statement
- **Primary Actor:** Customer / Reviewer  
- **Description:** Produce ordered, grouped statements for customer review.  
- **Preconditions:** Customer has transaction history.  
- **Trigger:** Customer requests statement via CLI/UI.  
- **Main Flow:**  
  1. Fetch transaction list.  
  2. Sort by timestamp, group by type.  
  3. Summarize totals.  
  4. Render formatted statement payload or file.  
- **Postconditions:** Statement available for download/display.

### Use Case 4 - Document Git Workflow
- **Primary Actor:** Developer/Reviewer  
- **Description:** Provide Git instructions templates for assignments.  
- **Preconditions:** GitHub repo exists.  
- **Trigger:** Developer starts assignment.  
- **Main Flow:**  
  1. Open template doc.  
  2. Create branch `feature/assignment-x`.  
  3. Follow commit/PR checklist.  
  4. Raise PR referencing issue template.  
- **Postconditions:** Consistent version control practices.

### Use Case 5 - Execute Bank Operations
- **Primary Actor:** Teller (via service)  
- **Description:** Author operation interface implementations executed by the batch processor.  
- **Preconditions:** Operation definitions exist.  
- **Main Flow:**  
  1. Teller triggers `FundTransferOperation`.  
  2. Interface's `authorize`/`execute` run.  
  3. Cache updates via `GenericCache`.  
- **Postconditions:** Transaction recorded, cache warmed.

### Use Case 6 - Monitor Exceptions & Config
- **Primary Actor:** Compliance Officer / Developer  
- **Description:** Track exception counts, highlight spikes, and adjust config via loader.  
- **Preconditions:** Services wired with config/exceptions.  
- **Trigger:** Runtime exception occurs or config reload requested.  
- **Main Flow:**  
  1. Exception layer increments lookup map.  
  2. Config loader reads properties/env.  
  3. Dashboard shows counts/prior version.  
- **Postconditions:** Visibility into system stability.

### Use Case 7 - Maintain Ledger Schema
- **Primary Actor:** Developer/DBA  
- **Description:** Define and execute DDL for accounts-ledgers ecosystem.  
- **Preconditions:** DBA access to RDBMS.  
- **Trigger:** Schema initialization or migration script run.  
- **Main Flow:**  
  1. Create tables with constraints.  
  2. Insert seed rows.  
  3. Commit changes.  
- **Postconditions:** Database ready for Spring services.

### Use Case 8 - Run Balance Analytics & Alerts
- **Primary Actor:** Compliance Officer  
- **Description:** Execute JOIN reports and PL/SQL to flag >10k transfers.  
- **Preconditions:** Schema seeded.  
- **Trigger:** Scheduled job or manual query.  
- **Main Flow:**  
  1. Run balance view SQL.  
  2. Execute `raise_high_value_alerts`.  
  3. Inspect `alerts` table.  
- **Postconditions:** Overdrafts/alerts recorded for dashboards.

### Use Case 9 - Persist via JPA
- **Primary Actor:** Developer  
- **Description:** Map schema to Spring entities and seed runtime data.  
- **Preconditions:** Spring Boot project scaffolded.  
- **Main Flow:**  
  1. Annotate entities and relationships.  
  2. Configure `CommandLineRunner` to save sample customers/accounts.  
  3. Verify records via H2/Postgres console.  
- **Postconditions:** Data accessible to REST services.

### Use Case 10 - REST API for Accounts & Transactions
- **Primary Actor:** External System / UI  
- **Description:** Provide endpoints for reading accounts/transactions and creating transfers/alerts.  
- **Preconditions:** Entities and services ready.  
- **Trigger:** API call (GET/POST).  
- **Main Flow:**  
  1. Controller receives DTO.  
  2. Validation occurs.  
  3. Service updates database and returns response.  
- **Alternate Flow:** Validation fails -> return 400 + error details.  
- **Postconditions:** API consumers can interact with banking data.

### Use Case 11 - Repository Queries + Security
- **Primary Actor:** Teller / Audit team  
- **Description:** Fetch high-value transactions, secure writes.  
- **Preconditions:** Spring Data repos defined.  
- **Main Flow:**  
  1. Query repository for transactions > threshold.  
  2. Spring Security intercepts request; ensures `ROLE_TELLER`.  
  3. Return authorized data or 403.  
- **Postconditions:** Audit-ready queries secured.

### Use Case 12 - Exception Metrics Endpoint
- **Primary Actor:** Developer/Reviewer  
- **Description:** Surface exception tallies via HTML/REST endpoint.  
- **Preconditions:** Monitoring module loaded.  
- **Trigger:** Reviewer opens metrics endpoint.  
- **Main Flow:**  
  1. Endpoint fetches counts map.  
  2. Renders table/chart.  
- **Postconditions:** Teams can see exception hotspots.

### Use Case 13 - React Dashboard
- **Primary Actor:** Customer / UI user  
- **Description:** Display live balances/alerts from REST API.  
- **Preconditions:** Backend endpoints available.  
- **Main Flow:**  
  1. React fetches `/accounts` and `/alerts`.  
  2. Renders tiles and tables.  
  3. Offers manual refresh.  
- **Postconditions:** Frontend reflects latest state.

### Use Case 14 - React Transfer Form
- **Primary Actor:** Customer  
- **Description:** Capture transfer fields and submit; includes inline validation.  
- **Preconditions:** Dashboard loaded, accounts listed.  
- **Main Flow:**  
  1. User fills from/to accounts and amount.  
  2. Client validates positive amount and required fields.  
  3. Sends POST to `/transactions`.  
- **Alternate Flow:** Validation error -> show inline message; API error -> show toast.  
- **Postconditions:** Transfer request sent; UI updates on success.

### Use Case 15 - Redux & End-to-End Demo
- **Primary Actor:** Project Reviewer  
- **Description:** Combine Redux state, story documentation, and demo video for final review.  
- **Preconditions:** All prior phases complete.  
- **Main Flow:**  
  1. Redux slices load accounts/alerts.  
  2. Reviewer follows narrative (onboarding->transfer->alert).  
  3. Watch demo/read README.  
- **Postconditions:** Project ready for grading/delivery.

## Review Checklist

- Branch per assignment with README notes, SQL scripts, tests, and demo info.  
- Team branches include demos covering API + React outcomes.  
- Document any outstanding risks or assumptions per use case in the README or issue tracker.

Let me know if you want a printable PDF version or integration with your acceptance checklist. 
