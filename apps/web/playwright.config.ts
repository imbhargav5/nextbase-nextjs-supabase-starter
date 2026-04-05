import { devices, type PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

const PORT = process.env.PORT || 3000;
const baseURL = `http://localhost:${PORT}`;

const config: PlaywrightTestConfig = {
  workers: 2,
  timeout: 60 * 1000,
  testDir: path.join(__dirname, 'e2e'),
  retries: 2,
  outputDir: 'test-results/',
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command: 'pnpm build && pnpm start',
    url: baseURL,
    timeout: 180 * 1000,
    reuseExistingServer: !process.env.CI,
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
    video: process.env.CI ? 'retain-on-failure' : 'off',
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
  },
  projects: [
    {
      name: 'with-user-setup',
      testMatch: '_setups/user.setup.ts',
    },
    {
      name: 'logged-in-users',
      testMatch: 'user/**/*.spec.ts',
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
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  globalSetup: './playwright/global-setup.ts',
};

export default config;
