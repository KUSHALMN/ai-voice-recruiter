import { test, expect } from '@playwright/test'

test.describe('Candidate Interview Room E2E', () => {
  test('should load the candidate interview room successfully', async ({ page }) => {
    await page.goto('/interview/demo-1')

    // Expect page to load without 404 or crash
    await expect(page).toHaveTitle(/AI Voice Recruiter|Interview/i)

    // Check header elements
    await expect(page.locator('header')).toBeVisible()

    // Check presence of Speech / Audio section
    await expect(page.getByText(/Speech & Audio Stream/i)).toBeVisible()

    // Check presence of Voice or Answer button
    const answerButton = page.getByRole('button', { name: /Answer with Voice|Start Interview/i })
    await expect(answerButton).toBeVisible()
  })

  test('should toggle code editor sandbox when technical problem is present', async ({ page }) => {
    await page.goto('/interview/demo-1')

    // Find code editor toggle if present
    const codeToggle = page.getByRole('button', { name: /Code Editor|Sandbox/i })
    if (await codeToggle.isVisible()) {
      await codeToggle.click()
      await expect(page.locator('.monaco-editor')).toBeVisible()
    }
  })
})
