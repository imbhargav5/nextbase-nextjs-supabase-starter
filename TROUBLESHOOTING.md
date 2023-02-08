## HUSKY setup

If you have trouble running husky pre commit hooks, make sure they have executable permissions. You can do this by running

```bash
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

## Github Actions

`GH_TOKEN` - Needs to have write access for semantic release action. Generate a personal access token else RELEASE action will fail.
