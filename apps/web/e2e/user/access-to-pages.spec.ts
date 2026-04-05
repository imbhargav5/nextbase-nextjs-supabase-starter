import { test, expect } from '@playwright/test';

test.describe('Logged-in user page access', () => {
  test('can access dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('can access private items', async ({ page }) => {
    await page.goto('/private-items');
    await expect(page).toHaveURL('/private-items');
  });

  test('can access home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });
});
