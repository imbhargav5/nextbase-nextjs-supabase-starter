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

export async function configurePlaywrightEnv() {
  const projectDir = path.resolve(__dirname, '..');
  const envTestPath = path.join(projectDir, '.env.test');
  const envTestLocalPath = path.join(projectDir, '.env.test.local');
  const envProductionLocalPath = path.join(projectDir, '.env.production.local');

  console.log('[global-setup] Project dir:', projectDir);

  if (!fs.existsSync(envTestPath)) {
    throw new Error(`[global-setup] .env.test not found at ${envTestPath}`);
  }

  fs.copyFileSync(envTestPath, envTestLocalPath);
  fs.copyFileSync(envTestPath, envProductionLocalPath);
  console.log('[global-setup] Copied .env.test to .env.test.local and .env.production.local');

  const databaseDir = path.resolve(projectDir, '..', 'database');
  console.log('[global-setup] Running supabase status in:', databaseDir);

  try {
    const statusOutput = execSync('pnpm supabase status --output env', {
      cwd: databaseDir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const parsed = parseEnvOutput(statusOutput);
    const publishableKey = parsed.PUBLISHABLE_KEY;
    const apiUrl = parsed.API_URL;

    if (!(publishableKey && apiUrl)) {
      throw new Error('[global-setup] Failed to extract Supabase API URL and publishable key');
    }

    for (const envPath of [envTestLocalPath, envProductionLocalPath]) {
      let envContent = fs.readFileSync(envPath, 'utf-8');
      envContent = envContent.replace(
        /NEXT_PUBLIC_SUPABASE_URL=.*/,
        `NEXT_PUBLIC_SUPABASE_URL=${apiUrl}/`
      );
      envContent = envContent.replace(
        /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=.*/,
        `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${publishableKey}`
      );
      envContent = envContent.replace(
        /NEXT_PUBLIC_SITE_URL=.*/,
        `NEXT_PUBLIC_SITE_URL=${process.env.PLAYWRIGHT_TEST_BASE_URL ?? 'http://localhost:3000/'}`
      );
      fs.writeFileSync(envPath, envContent);
    }
    console.log(
      '[global-setup] Updated .env.test.local and .env.production.local with Supabase settings'
    );
  } catch (error) {
    const err = error as { stderr?: string; stdout?: string; message?: string };
    console.error('[global-setup] Failed to run supabase status');
    if (err.stdout) {
      console.error('[global-setup] stdout:', err.stdout);
    }
    if (err.stderr) {
      console.error('[global-setup] stderr:', err.stderr);
    }
    throw new Error(
      err.message ??
        '[global-setup] Supabase is not running. Start it with: cd apps/database && pnpm supabase start'
    );
  }
}

export default configurePlaywrightEnv;

if (require.main === module) {
  void configurePlaywrightEnv().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
