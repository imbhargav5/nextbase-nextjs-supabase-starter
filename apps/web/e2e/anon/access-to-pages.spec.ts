import { test, expect } from '@playwright/test';

test.describe('Anonymous user page access', () => {
  test('can access home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('can access about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('can access login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
  });

  test('can access sign-up page', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page).toHaveURL('/sign-up');
  });

  test('is redirected from dashboard to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('is redirected from private items to login', async ({ page }) => {
    await page.goto('/private-items');
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });
});
