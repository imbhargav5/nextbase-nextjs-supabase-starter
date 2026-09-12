import { expect, test } from '@playwright/test';

test.describe.parallel('Anonymous user public pages', () => {
  test('can access the home page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('heading', { name: /build your.+saas product.+faster/i })
    ).toBeVisible();
    await expect(
      page.getByRole('main').getByRole('link', { name: /get started/i })
    ).toBeVisible();
  });

  test('can access the login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveURL('/login');
    await expect(page.getByText(/sign in to menace next/i)).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Magic Link' })).toBeVisible();
  });

  test('can access the sign-up page', async ({ page }) => {
    await page.goto('/sign-up');

    await expect(page).toHaveURL('/sign-up');
    await expect(page.getByText(/create your menace next account/i)).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Magic Link' })).toBeVisible();
  });

  test('can access the template marketplace', async ({ page }) => {
    await page.goto('/templates');

    await expect(page).toHaveURL('/templates');
    await expect(
      page.getByRole('heading', { name: /template marketplace/i }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /view template/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /open scaffold/i })).toBeVisible();
  });

  test('can access the Intellune template scaffold', async ({ page }) => {
    await page.goto('/templates/intellune');

    await expect(page).toHaveURL('/templates/intellune');
    await expect(page.locator('[data-template="intellune"]')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /intellune/i }),
    ).toBeVisible();
  });

  test('can access the Nguyen template demo', async ({ page }) => {
    await page.goto('/templates/nguyen');

    await expect(page).toHaveURL('/templates/nguyen');
    await expect(
      page.getByRole('heading', {
        name: /the unified workspace/i,
      }),
    ).toBeVisible();
    await expect(page.locator('[data-template="nguyen"]')).toBeVisible();
  });
});
