import { test, expect } from '@playwright/test'

test('should have text in about page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('/about')
  await expect(page.locator('h1')).toContainText('About')
})
