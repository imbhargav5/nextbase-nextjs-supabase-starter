import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run') || process.env.DRY_RUN === '1';
const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const packagePath = resolve(rootDir, 'apps/web/package.json');
const { version } = JSON.parse(readFileSync(packagePath, 'utf8'));
const tagName = `v${version}`;

const run = (command, commandArgs, options = {}) =>
  execFileSync(command, commandArgs, {
    cwd: rootDir,
    stdio: dryRun ? 'pipe' : 'inherit',
    encoding: 'utf8',
    ...options,
  }).trim();

let versionFileChanged = false;

try {
  const changedFiles = run('git', ['diff', '--name-only', 'HEAD^', 'HEAD', '--', 'apps/web/package.json']);
  versionFileChanged = changedFiles.length > 0;
} catch {
  versionFileChanged = false;
}

if (!versionFileChanged) {
  console.log('No version change detected in apps/web/package.json, skipping GitHub release.');
  process.exit(0);
}

if (dryRun) {
  console.log(`Would create GitHub release ${tagName} from ${packagePath}.`);
  process.exit(0);
}

let releaseExists = false;

try {
  run('gh', ['release', 'view', tagName]);
  releaseExists = true;
} catch {
  releaseExists = false;
}

if (releaseExists) {
  console.log(`Release ${tagName} already exists, skipping.`);
  process.exit(0);
}

const commit = process.env.GITHUB_SHA || run('git', ['rev-parse', 'HEAD']);

run('gh', [
  'release',
  'create',
  tagName,
  '--target',
  commit,
  '--title',
  tagName,
  '--generate-notes',
  '--latest',
]);
