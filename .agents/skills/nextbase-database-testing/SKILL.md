---
name: nextbase-database-testing
description: Use for NextBase pgTap tests, database_test.sql, RLS behavior tests, constraint assertions, plan counts, transaction cleanup, or running the local Supabase database test suite.
---

# NextBase Database Testing

Load `supabase`, `supabase-postgres-best-practices`, and `supabase-schema-migrations` for database work.

The canonical suite is `apps/database/supabase/tests/database_test.sql`. It is one pgTap script wrapped in `BEGIN` and `ROLLBACK`, currently using an explicit `plan(42)` and `SELECT * FROM finish()`.

## Match the Existing Shape

- Add assertions to the canonical file unless the test runner and repository intentionally adopt multiple files.
- Update `plan(N)` every time assertions are added or removed. Count pgTap assertions, not SQL statements or comments.
- Use built-in pgTap assertions and ordinary SQL. This repository does not provide a custom `tests` helper schema.
- Keep fixtures inside the transaction and use deterministic UUIDs or returned IDs. Never rely on persistent local data.

## What to Assert

- Structural tests: columns, types, nullability, primary/foreign keys, indexes, functions, triggers, and policy definitions.
- Behavioral tests: what `anon`, `authenticated`, an owner, and a different user can actually select, insert, update, or delete.
- RLS ownership tests must cover both the allowed owner path and the denied cross-user path.
- Constraint tests should assert the expected SQLSTATE or unchanged state, not a brittle full server error string.

Set the local role and JWT claims only for the assertion that requires them, then restore or replace them before the next persona. Remember that denied `INSERT` operations may raise while denied `UPDATE` or `DELETE` operations may affect zero rows; assert the actual PostgreSQL behavior and final state.

## Workflow

1. Start local Supabase from the repository workflow.
2. Apply or regenerate the declarative schema change.
3. Add the smallest failing pgTap assertion.
4. Keep the plan count exact and the transaction rollback intact.
5. Run:

```bash
pnpm --dir apps/database test-db
```

A passing structural policy-name check is not proof that RLS behavior is correct; include behavioral assertions for authorization changes.
