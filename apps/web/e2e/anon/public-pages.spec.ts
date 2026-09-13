import { expect, test } from '@playwright/test';

test.describe.parallel('Anonymous user public pages', () => {
  test('can access the home page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('heading', { name: /launch landing pages that actually run/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('main').getByRole('link', { name: /browse kits/i }),
    ).toBeVisible();
  });

  test('can access the login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveURL('/login');
    await expect(page.getByText(/sign in to prompt market/i)).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Magic Link' })).toBeVisible();
  });

  test('can access the sign-up page', async ({ page }) => {
    await page.goto('/sign-up');

    await expect(page).toHaveURL('/sign-up');
    await expect(
      page.getByText(/create your prompt market account/i),
    ).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Magic Link' })).toBeVisible();
  });

  test('can access the kits catalog', async ({ page }) => {
    await page.goto('/kits');

    await expect(page).toHaveURL('/kits');
    await expect(page.getByRole('heading', { name: /^kits$/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /view kit/i })).toBeVisible();
  });

  test('can access the SaaS Launch Kit product page', async ({ page }) => {
    await page.goto('/kit/saas-launch-kit');

    await expect(page).toHaveURL('/kit/saas-launch-kit');
    await expect(
      page.getByRole('heading', { name: /saas launch kit/i }),
    ).toBeVisible();
  });

  test('can access the Portfolio Launch Kit product page', async ({ page }) => {
    await page.goto('/kit/portfolio-launch-kit');

    await expect(page).toHaveURL('/kit/portfolio-launch-kit');
    await expect(
      page.getByRole('heading', { name: /portfolio launch kit/i }),
    ).toBeVisible();
  });

  test('can access build-idea prompts', async ({ page }) => {
    await page.goto('/prompts');

    await expect(page).toHaveURL('/prompts');
    await expect(
      page.getByRole('heading', { name: /what you can build with a kit/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/ai support inbox for ecommerce/i).first(),
    ).toBeVisible();
    await expect(
      page.getByText(/wedding and event photography/i).first(),
    ).toBeVisible();
  });

  test('legacy /templates redirects to prompts', async ({ page }) => {
    await page.goto('/templates');
    await expect(page).toHaveURL('/prompts');
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
