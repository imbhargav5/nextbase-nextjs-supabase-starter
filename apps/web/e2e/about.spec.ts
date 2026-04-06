import { test, expect } from '@playwright/test';

test('about page has heading', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('h1')).toBeVisible();
});
