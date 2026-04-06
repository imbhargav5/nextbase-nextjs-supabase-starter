## HUSKY setup

If you have trouble running husky pre commit hooks, make sure they have executable permissions. You can do this by running

```bash
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

## Github Actions

The release automation uses the default `GITHUB_TOKEN`. No separate npm token or personal
access token is required because this repo only creates version PRs and GitHub releases.
