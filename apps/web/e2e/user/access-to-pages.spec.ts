import { test, expect } from '@playwright/test';

test.describe.parallel('Logged-in user page access', () => {
  test('can access dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
    await expect(
      page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();
  });

  test('can access private items', async ({ page }) => {
    await page.goto('/private-items');
    await expect(page).toHaveURL('/private-items');
    await expect(
      page.getByRole('heading', { name: 'Private Items', level: 1 })
    ).toBeVisible();
  });

  test('can access home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('heading', { name: /build your.+saas product.+faster/i })
    ).toBeVisible();
  });

  test('can access about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL('/about');
    await expect(
      page.getByRole('heading', { name: /modern full-stack starter kit/i })
    ).toBeVisible();
  });
});
