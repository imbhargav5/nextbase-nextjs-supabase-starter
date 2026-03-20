# CI/CD Pipeline Setup

This document describes the CI/CD workflow implemented for the Nextbase Next.js Supabase Starter project.

## Overview

The CI/CD pipeline is configured in `.github/workflows/ci-cd.yml` and provides:

- **Parallel Quality Checks**: Lint, security scanning, and testing run simultaneously for fast feedback
- **Gated Builds**: Build only runs if all quality checks pass
- **Automated Releases**: Creates GitHub releases with build artifacts for easy deployment

## Workflow Structure

### Trigger Events
The pipeline runs on:
- Pull requests opened against `main` branch
- New commits pushed to existing pull requests (synchronize)

### Jobs

#### 1. Quality Checks (Parallel)
- **lint**: Runs ESLint and Prettier formatting checks
- **security-scan**: Performs CodeQL security analysis
- **test**: Executes unit tests and type checking

#### 2. Build (Sequential)
- **build**: Only runs if all quality checks pass
- Creates optimized production build
- Uploads build artifacts to GitHub

#### 3. Release (Sequential)
- **release**: Creates GitHub release with build artifacts
- Tags releases with `dev-{commit-sha}` format
- Marks as prerelease for development builds

## Usage

### Creating a Pull Request
1. Create a new branch from `main`:
   ```bash
   git checkout main
   git pull
   git checkout -b feature/your-feature
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push -u origin feature/your-feature
   ```

3. Open a pull request on GitHub

4. The CI/CD pipeline will automatically run and show status checks

### Viewing Build Artifacts
After a successful build, you can download the build artifacts from:
- The Actions tab in your GitHub repository
- The specific workflow run
- Under the "Artifacts" section

### GitHub Release Assets
Each successful pipeline creates a GitHub release with:
- Release title: "Dev Build {commit-sha}"
- Tag: "dev-{commit-sha}"
- Build artifacts attached as ZIP files

## Configuration Details

### Node.js Version
- Uses Node.js 16.x for all jobs
- Matches the workflow requirements

### Package Manager
- Uses npm for dependency management
- Matches the workflow requirements

### Build Output
- Build artifacts stored in `dist/` directory
- Artifacts uploaded as "dist" for the release job

### Security Scanning
- CodeQL analysis for JavaScript/TypeScript
- Automated vulnerability detection

## Troubleshooting

### Failed Quality Checks
If quality checks fail:
1. Check the Actions tab for detailed error logs
2. Fix issues locally and push new commits
3. Pipeline will automatically re-run

### Build Failures
If the build job fails:
1. Ensure all quality checks pass first
2. Check for TypeScript errors or build configuration issues
3. Verify dependencies are properly installed

### Release Failures
If the release job fails:
1. Check if build job completed successfully
2. Verify GitHub token permissions
3. Ensure artifact download succeeded

## Badge Integration

Add this badge to your README to show pipeline status:

```markdown
![CI Pipeline Badge](https://github.com/your-username/your-repo/actions/workflows/ci-cd.yml/badge.svg)
```

Replace `your-username` and `your-repo` with your actual GitHub username and repository name.