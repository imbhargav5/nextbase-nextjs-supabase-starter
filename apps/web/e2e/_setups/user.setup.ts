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

  // Verify we're logged in
  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });

  // Save the authentication state
  await page.context().storageState({ path: authFile });
});
