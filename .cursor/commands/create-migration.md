# Create migration

1. Create a migration file following the db migrations cursor rule.
2. Once the migration is created following the db migrations rule, apply the migrations to the local supabase database using pnpm supabase migrations up. If applying the migrations fails for some reason, stop and ask next steps if I want to reset. Don't reset without a confirmation.
3. generate local types using pnpm generate:types:local and then
4. write pg tap test cases.

Run the pg tap tests using pnpm supabase test db and then ensure all tests pass.
