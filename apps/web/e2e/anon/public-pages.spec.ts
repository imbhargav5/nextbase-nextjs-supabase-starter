import { expect, test } from '@playwright/test';

test.describe.parallel('Anonymous user public pages', () => {
  test('can access the home page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('heading', { name: /build your.+saas product.+faster/i })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /get started/i }).first()
    ).toBeVisible();
  });

  test('can access the about page', async ({ page }) => {
    await page.goto('/about');

    await expect(page).toHaveURL('/about');
    await expect(
      page.getByRole('heading', { name: /modern full-stack starter kit/i })
    ).toBeVisible();
  });

  test('can access the login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Login to NextBase')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Magic Link' })).toBeVisible();
  });

  test('can access the sign-up page', async ({ page }) => {
    await page.goto('/sign-up');

    await expect(page).toHaveURL('/sign-up');
    await expect(page.getByText('Register to NextBase')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Magic Link' })).toBeVisible();
  });
});
