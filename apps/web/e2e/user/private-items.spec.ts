import { test, expect } from '@playwright/test';

test.describe('Private items management', () => {
  test('can navigate to create new item', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: /new private item/i }).click();
    await expect(page).toHaveURL('/dashboard/new');
    await expect(
      page.getByRole('heading', { name: 'Create Private Item' })
    ).toBeVisible();
  });

  test('can create a private item and see it in the private items list', async ({
    page,
  }) => {
    await page.goto('/dashboard/new');
    const timestamp = Date.now();
    const itemName = `Test Item ${timestamp}`;
    const itemDescription = `A test description for this item ${timestamp}`;

    await page.getByLabel(/name/i).fill(itemName);
    await page.getByLabel(/description/i).fill(itemDescription);
    await page.getByRole('button', { name: /create private item/i }).click();

    await expect(page).toHaveURL(/private-item\//, { timeout: 15000 });
    await expect(page.getByText(itemName)).toBeVisible();
    await expect(
      page.locator('p', { hasText: itemDescription })
    ).toBeVisible();

    await page.goto('/private-items');
    await expect(
      page.getByRole('heading', { name: 'Private Items', level: 1 })
    ).toBeVisible();
    await expect(page.getByText(itemName)).toBeVisible();
  });
});
