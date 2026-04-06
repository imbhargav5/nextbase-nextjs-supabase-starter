import { execSync } from 'node:child_process';
import { devices, type PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

const PORT = process.env.PORT || 3000;
const baseURL = `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

process.env.PLAYWRIGHT_TEST_BASE_URL ??= `${baseURL}/`;

function parseEnvOutput(output: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of output.split('\n')) {
    const match = line.match(/^([A-Z_]+)="(.+)"$/);
    if (match) result[match[1]] = match[2];
  }
  return result;
}

function getWebServerEnv() {
  const webServerEnv = { ...process.env };
  const databaseDir = path.resolve(__dirname, '..', 'database');

  try {
    const statusOutput = execSync('pnpm exec supabase status --output env', {
      cwd: databaseDir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const parsed = parseEnvOutput(statusOutput);

    if (!(parsed.API_URL && parsed.PUBLISHABLE_KEY)) {
      throw new Error('Supabase status is missing API_URL or PUBLISHABLE_KEY');
    }

    webServerEnv.NEXT_PUBLIC_SUPABASE_URL = `${parsed.API_URL}/`;
    webServerEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = parsed.PUBLISHABLE_KEY;
    webServerEnv.NEXT_PUBLIC_SITE_URL = `${baseURL}/`;
    return webServerEnv;
  } catch (error) {
    const err = error as { message?: string };
    throw new Error(
      err.message ??
        'Playwright webServer could not resolve local Supabase settings. Start Supabase with: cd apps/database && pnpm supabase start'
    );
  }
}

const webServerEnv = getWebServerEnv();

const config: PlaywrightTestConfig = {
  workers: 2,
  timeout: 120 * 1000,
  testDir: path.join(__dirname, 'e2e'),
  retries: 2,
  outputDir: 'test-results/',
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  webServer: {
    command: isCI ? 'pnpm start' : 'pnpm build && pnpm start',
    cwd: __dirname,
    env: webServerEnv,
    url: baseURL,
    timeout: isCI ? 180 * 1000 : 300 * 1000,
    reuseExistingServer: !isCI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  expect: {
    timeout: 15 * 1000,
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    navigationTimeout: 30 * 1000,
    actionTimeout: 30 * 1000,
    video: isCI ? 'retain-on-failure' : 'off',
    screenshot: isCI ? 'only-on-failure' : 'off',
  },
  projects: [
    {
      name: 'with-user-setup',
      testMatch: '_setups/user.setup.ts',
    },
    {
      name: 'logged-in-users',
      testMatch: 'user/**/*.spec.ts',
      grepInvert: /Anonymous user/,
      retries: 0,
      dependencies: ['with-user-setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user_1.json',
      },
    },
    {
      name: 'anon-users',
      testMatch: 'anon/**/*.spec.ts',
      grep: /Anonymous user/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  globalSetup: './playwright/global-setup.ts',
};

export default config;
