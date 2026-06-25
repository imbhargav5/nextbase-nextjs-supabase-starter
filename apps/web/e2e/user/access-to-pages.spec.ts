import { test, expect } from '@playwright/test';

test.describe.parallel('Logged-in user page access', () => {
  test('is redirected from /dashboard into the app', async ({ page }) => {
    await page.goto('/dashboard');
    // /dashboard now redirects to /inbox (which sends users without a
    // workspace on to /onboarding). The logged-in user should never be left
    // on /dashboard or bounced back to /login.
    await expect(page).not.toHaveURL(/login/, { timeout: 10000 });
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('can access a protected page when logged in', async ({ page }) => {
    await page.goto('/projects');
    // A logged-in user is admitted to the protected area. Depending on whether
    // they have a workspace yet they land on /projects or are routed to
    // /onboarding, but they are never redirected to /login.
    await expect(page).toHaveURL(/\/(projects|onboarding|inbox)/, {
      timeout: 10000,
    });
    await expect(page).not.toHaveURL(/login/);
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
