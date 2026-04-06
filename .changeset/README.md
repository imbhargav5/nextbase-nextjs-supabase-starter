# Changesets

Add a changeset in feature PRs that change the starter in a way that should be released:

```bash
pnpm changeset
```

This repo only versions `apps/web`. Internal workspace packages remain ignored, and the
repo-level `package.json` version plus `CHANGELOG.md` are synchronized from `apps/web`
when the version PR is generated.
