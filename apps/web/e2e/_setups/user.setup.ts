import { test as setup, expect } from '@playwright/test';
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

  // A freshly signed-up user has no workspace yet, so they are routed to
  // /onboarding. Confirm the user is authenticated (not bounced to /login).
  await page.goto('/onboarding');
  await expect(page).not.toHaveURL(/login/, { timeout: 15000 });
  await expect(
    page.getByRole('button', { name: /create workspace/i })
  ).toBeVisible();

  // Complete onboarding by creating a workspace so downstream logged-in tests
  // have an authenticated user WITH a workspace.
  await page.getByPlaceholder('Acme Inc').fill('E2E Test Workspace');
  const submitButton = page.getByRole('button', { name: /create workspace/i });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Successful onboarding pushes the user to the inbox.
  await page.waitForURL(/\/inbox/, { timeout: 15000 });

  // Save the authentication state (now with an active workspace)
  await page.context().storageState({ path: authFile });
});
