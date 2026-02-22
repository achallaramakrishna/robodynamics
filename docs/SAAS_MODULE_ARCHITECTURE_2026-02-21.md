# SaaS Module Architecture (2026-02-21)

## Why this model

Support both:
1. Individual B2C parents/students
2. School/institution B2B customers

with one unified module-access engine.

## Core tables

1. `rd_users`: existing identity table (all users).
2. `rd_modules`: module catalog (`APTIPATH`, `EXAM_PREP`, `COURSE`, ...).
3. `rd_companies`: tenant records (school/company/individual account container).
4. `rd_user_company_map`: maps user to one or more companies with role.
5. `rd_company_permissions`: company-level module license/entitlement.
6. `rd_user_permissions`: user-level override + feature-level permissions.
7. `rd_ci_subscription`: individual checkout entitlement records (already implemented).

## Access resolution order

For a given user and module:

1. `rd_user_permissions` (direct override, highest priority)
2. `rd_company_permissions` via `rd_user_company_map`
3. Fallback to `rd_ci_subscription` for individual purchases

## Where AptiPath vs other modules are stored

1. `rd_ci_subscription.module_code`
2. `rd_ci_subscription.plan_type`
3. `rd_modules.module_code`
4. `rd_company_permissions (company_id + module_id)`
5. `rd_user_permissions (user_id + module_id + feature_code)`

This lets the same user access AptiPath, Exam Prep, and Course modules based on purchased license and/or assigned company permissions.
