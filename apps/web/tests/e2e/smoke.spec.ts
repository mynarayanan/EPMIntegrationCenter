import { test, expect } from '@playwright/test';

test.describe('Control Plane Smoke Tests', () => {
  test('redirects unauthenticated visitors from /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /Sign in to Control Plane/i })).toBeVisible();
  });

  test('renders login and workspace provisioning toggle on /login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/Work Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();

    await page.getByRole('button', { name: /Provision a new workspace/i }).click();
    await expect(
      page.getByRole('heading', { name: /Provision Enterprise Workspace/i })
    ).toBeVisible();
  });
});
