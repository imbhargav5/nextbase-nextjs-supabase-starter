import { test as setup } from '@playwright/test';
import { signupUserHelper } from '../_helpers/signup.helper';
import path from 'path';
import fs from 'fs';

const authFile = 'playwright/.auth/user_1.json';

setup('create test user', async ({ page }) => {
  const timestamp = Date.now();
  const emailAddress = `testuser${timestamp}@example.com`;

  // Ensure auth directory exists
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await signupUserHelper({ page, emailAddress });

  // User is authenticated after signup. The post-signup redirect chain
  // (/auth/callback -> /dashboard -> /inbox -> /onboarding) may still be
  // in flight, so a hard goto waiting until `load` races with it and aborts.
  // Use a commit-only navigation and tolerate the redirect race.
  await page.goto('/onboarding', { waitUntil: 'commit' }).catch(() => {});
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  // Settle on whichever authenticated route we land on.
  await page
    .waitForURL(/\/(onboarding|inbox|projects|dashboard)/, { timeout: 30000 })
    .catch(() => {});

  // If we're on onboarding (no workspace yet), create one so downstream
  // logged-in tests have an authenticated user WITH a workspace.
  if (page.url().includes('/onboarding')) {
    await page.getByPlaceholder('Acme Inc').fill('E2E Test Workspace');
    const createBtn = page.getByRole('button', { name: 'Create workspace' });
    await createBtn.click();
    await page.waitForURL(/\/inbox/, { timeout: 30000 });
  }
  // else: already has a workspace (landed on /inbox etc.) — proceed to save state.

  // Save the authentication state (now with an active workspace)
  await page.context().storageState({ path: authFile });
});
