import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function parseEnvOutput(output: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of output.split('\n')) {
    const match = line.match(/^([A-Z_]+)="(.+)"$/);
    if (match) result[match[1]] = match[2];
  }
  return result;
}

export default async () => {
  const projectDir = process.cwd();
  const envTestPath = path.join(projectDir, '.env.test');
  const envLocalPath = path.join(projectDir, '.env.local');

  console.log('[global-setup] Project dir:', projectDir);

  // Use .env.local as base if .env.test doesn't exist
  const sourcePath = fs.existsSync(envTestPath) ? envTestPath : envLocalPath;
  const targetPath = path.join(projectDir, '.env.test.local');

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log('[global-setup] Copied env to .env.test.local');
  }

  // Try to get supabase keys dynamically
  const databaseDir = path.join(projectDir, '..', '..', 'apps', 'database');
  console.log('[global-setup] Running supabase status in:', databaseDir);

  try {
    const statusOutput = execSync('pnpm supabase status --output env', {
      cwd: databaseDir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const parsed = parseEnvOutput(statusOutput);
    const publishableKey = parsed.PUBLISHABLE_KEY;

    if (publishableKey && fs.existsSync(targetPath)) {
      let envContent = fs.readFileSync(targetPath, 'utf-8');
      envContent = envContent.replace(
        /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=.*/,
        `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${publishableKey}`
      );
      fs.writeFileSync(targetPath, envContent);
      console.log('[global-setup] Updated .env.test.local with Supabase publishable key');
    }
  } catch {
    console.warn('[global-setup] Could not get Supabase status — using existing env values');
  }
};
