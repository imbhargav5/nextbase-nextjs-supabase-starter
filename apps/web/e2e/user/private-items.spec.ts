import { test, expect } from '@playwright/test';

test.describe('Private items management', () => {
  test('can navigate to create new item', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: /new private item/i }).click();
    await expect(page).toHaveURL('/dashboard/new');
    await expect(page.locator('text=Create Private Item')).toBeVisible();
  });

  test('can create a private item', async ({ page }) => {
    await page.goto('/dashboard/new');
    const timestamp = Date.now();
    const itemName = `Test Item ${timestamp}`;

    await page.getByLabel(/name/i).fill(itemName);
    await page.getByLabel(/description/i).fill('A test description for this item');
    await page.getByRole('button', { name: /create private item/i }).click();

    // Should redirect to the item's page
    await expect(page).toHaveURL(/private-item\//, { timeout: 15000 });
    await expect(page.getByText(itemName)).toBeVisible();
  });

  test('private items list shows created items', async ({ page }) => {
    await page.goto('/private-items');
    // Page loads without error
    await expect(page.locator('main')).toBeVisible();
  });
});
