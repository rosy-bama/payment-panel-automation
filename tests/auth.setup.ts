import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { NavSidebar } from '../src/pages/NavSidebar';
import { env } from '../src/utils/env';

const authFile = '.auth/state.json';

/**
 * Runs once before the main test projects (see playwright.config.ts "setup" project).
 * Logs in the shared test account and saves the session so every spec doesn't have
 * to repeat the login+OTP flow. Delete .auth/state.json to force a fresh login.
 *
 * Confirmed (screenshots, 2026-09-09): the OTP step always follows password
 * entry - it's a TOTP authenticator-app code, not conditional. On testbox any
 * 6 digits are accepted; production must reject an incorrect one.
 *
 * TODO once confirmed: does the panel's session survive Playwright's storageState
 * (cookies + localStorage), or does it rely on a short-lived token that needs
 * refreshing per test? Flag to Rose if tests start failing with "session expired"
 * even though login itself passes.
 */
setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const nav = new NavSidebar(page);

  await loginPage.goto();
  await loginPage.login(env.username, env.password);
  await loginPage.submitOtp(env.otp);

  // Confirmed post-login marker: Dashboard greets the user by name.
  await expect(nav.welcomeText).toBeVisible({ timeout: 15_000 });

  await page.context().storageState({ path: authFile });
});
