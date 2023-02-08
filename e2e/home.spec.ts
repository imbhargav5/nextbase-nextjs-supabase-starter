import { test, expect } from '@playwright/test'

test('should have title in home page', async ({ page }) => {
    // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Awesome SAAS Project')
})