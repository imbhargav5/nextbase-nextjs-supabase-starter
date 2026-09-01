---
name: supabase-schema-migrations
description: Use for any NextBase Supabase schema, RLS, function, trigger, enum, index, extension, generated database type, or migration change and enforce this repository's schema-first generated-migration workflow.
---

# Supabase Schema Migrations

Load the vendored `supabase` and `supabase-postgres-best-practices` skills. Current Supabase documentation and the installed CLI are authoritative for command flags.

## Hard Boundary

- Never manually create migration files in `apps/database/supabase/migrations`.
- Never manually edit generated migration files.
- Never paste hand-written SQL directly into a migration file.
- Make schema changes first in `apps/database/supabase/schemas/*.sql`.
- Read generated migrations for review only. If generated SQL is wrong, fix the declarative schema and regenerate.

## Schema-First Workflow

1. Inspect neighboring files in `apps/database/supabase/schemas` and the existing migration history.
2. Edit or add the appropriate declarative schema file. Keep stable object ordering to reduce diff churn.
3. Start the local stack from the root with `pnpm database#start`.
4. From `apps/database`, generate the migration with `pnpm supabase db diff -f <descriptive_name>`.
5. Review the generated SQL for accidental drops, policy churn, missing grants, destructive conversions, ordering problems, and unrelated changes.
6. If it is wrong, fix the declarative schema, discard only the newly generated migration, and generate it again. Do not patch generated SQL.
7. Apply and validate the local schema as appropriate, then run `pnpm --dir apps/database test-db`.
8. From the root, run `pnpm gen-types-local`. The only generated TypeScript destination is `apps/web/src/lib/database.types.ts`.
9. Run the relevant lint, typecheck, test, and build commands for consumers.

## RLS and Security Review

For every exposed table or function, verify:

- RLS is enabled and forced where the design requires it.
- `USING` and `WITH CHECK` cover every intended role and operation.
- Ownership derives from `auth.uid()` or another trusted server value.
- Foreign keys used by policies and common joins have appropriate indexes.
- Functions use deliberate invoker/definer semantics, a safe `search_path`, and explicit execute grants.
- Grants and schema exposure do not broaden access unintentionally.

Add behavioral pgTap coverage for authorization changes; policy-name assertions alone are insufficient.

## Diff Limitations

Some operations are not represented safely by schema diff. If the desired change cannot be expressed by this workflow, stop and explain the limitation. Do not work around it by hand-authoring or editing a migration unless the repository rule itself is explicitly changed.
