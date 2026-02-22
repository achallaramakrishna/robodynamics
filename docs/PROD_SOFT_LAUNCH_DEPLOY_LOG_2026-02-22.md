# Production Soft Launch Deploy Log (2026-02-22)

## Target
- VPS: `168.231.123.108` (Ubuntu)
- App path: `/opt/tomcat/webapps/ROOT`
- Data path preserved: `/opt/robodynamics`
- DB: `robodynamics_db`

## Build Deployed
- Artifact: `target/robodynamics-0.0.1-SNAPSHOT.war`
- Local build command: `mvn -s .m2/settings-local.xml clean package -DskipTests`
- Build status: **SUCCESS**

## Deployment Steps Executed
1. Uploaded WAR to server:
   - `/root/robodynamics-0.0.1-SNAPSHOT.war`
2. Backed up current production WAR:
   - `/opt/tomcat/webapps/backup/ROOT.war.20260222_044254.bak`
3. Stopped Tomcat service.
4. Removed exploded app directory:
   - `/opt/tomcat/webapps/ROOT`
5. Replaced WAR:
   - `/opt/tomcat/webapps/ROOT.war`
6. Set ownership:
   - `tomcat:tomcat`
7. Restarted Tomcat and verified active status.

## Schema Diff Result (Local vs Prod)
- Table diff:
  - Local: `182`
  - Prod: `186`
  - Missing in prod from local: `0`
  - Extra in prod: `rd_company`, `rd_company_profiles`, `rd_v_student_subject_summary`, `rd_v_student_weak_sessions`
- AptiPath schema (`rd_ci_*`) diff:
  - **No column definition differences**

## Data Seeding Executed
- Problem found: production `rd_ci_question_bank` had `0` rows.
- Seed source: local `rd_ci_question_bank` rows for `module_code='APTIPATH'`.
- Insert issue fixed by using ASCII-safe seed SQL (prod charset rejected some unicode symbols).
- Final production counts:
  - `rd_ci_question_bank` total: `52`
  - AptiPath total: `52`
  - By version: `v1=10`, `v2=42`

## Post-Deploy Smoke Checks
- `http://127.0.0.1:8080/` -> `200`
- `http://127.0.0.1:8080/login` -> `200`
- `http://127.0.0.1:8080/platform/modules` -> `302`
- `http://127.0.0.1:8080/assets/videos/aptipath-student-onboarding.html` -> `200`
- `http://127.0.0.1:8080/assets/videos/aptipath-parent-onboarding.html` -> `200`
- `http://127.0.0.1:8080/aptipath/student/home` -> `302` (expected unauthenticated redirect)
- `http://127.0.0.1:8080/aptipath/parent/home` -> `302` (expected unauthenticated redirect)

## Notes
- Current production app is deployed at root context (`/`), not `/robodynamics`.
- Non-AptiPath tables show legacy schema drift between local/prod; no non-AptiPath schema changes were applied in this deployment.
- For next phase, seed `v3` question bank explicitly to avoid first-run runtime seeding delay.
