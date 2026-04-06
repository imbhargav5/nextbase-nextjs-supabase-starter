## HUSKY setup

If you have trouble running husky pre commit hooks, make sure they have executable permissions. You can do this by running

```bash
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

## Github Actions

The release workflow uses `GITHUB_TOKEN` with `contents: write` and `pull-requests: write`. No personal access token or npm token is required for release automation.
