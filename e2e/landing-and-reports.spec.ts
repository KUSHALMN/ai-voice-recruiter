import { test, expect } from '@playwright/test'

test.describe('Landing Page & Candidate Reports E2E', () => {
  test('should display home page with typewriter headline and CTA buttons', async ({ page }) => {
    await page.goto('/')

    // Verify main heading exists
    await expect(page.locator('h1')).toBeVisible()

    // Verify CTA button to create interview
    const createBtn = page.getByRole('button', { name: /Create First Interview|Start Free/i })
    await expect(createBtn).toBeVisible()
  })

  test('should render candidate executive dossier on shared report route', async ({ page }) => {
    await page.goto('/shared/report/demo-1')

    // Candidate report for Aarav Sharma should be visible
    await expect(page.getByText(/Aarav Sharma/i)).toBeVisible()
    await expect(page.getByText(/Software Engineer/i)).toBeVisible()

    // Executive summary or recommendation should be visible
    await expect(page.getByText(/Executive Summary|Recommendation|Score/i).first()).toBeVisible()
  })
})
