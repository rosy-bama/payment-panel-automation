import { test, expect } from '../../src/fixtures/test-fixtures';
import { env } from '../../src/utils/env';

/**
 * Authentication module - see docs/inferred-spec.md for the full module writeup.
 * Every "expected result" below is either confirmed with Rose or marked INFERRED.
 * This file intentionally runs unauthenticated (no storageState) since it's testing
 * the login flow itself.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication @smoke', () => {
  test('PP-AUTH-01 valid username + password + testbox OTP logs in successfully', async ({
    loginPage,
    nav,
  }) => {
    await loginPage.goto();
    await loginPage.login(env.username, env.password);
    await loginPage.submitOtp(env.otp);

    // Confirmed post-login marker (screenshot, 2026-09-09): Dashboard greets by name.
    await expect(nav.welcomeText).toBeVisible();
  });

  test('PP-AUTH-02 invalid password shows an error and does not log in', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(env.username, 'clearly-wrong-password');

    // INFERRED expected result - confirm the actual error copy/behavior with Rose.
    // Also unconfirmed: does an invalid password even reach the OTP screen, or
    // does it fail before that? Assuming "before" here - correct if wrong.
    await loginPage.expectLoginError();
    await expect(loginPage.otpHeading).not.toBeVisible();
  });

  test.skip(
    'PP-AUTH-03 production OTP must reject an arbitrary/incorrect authenticator code (testbox intentionally allows any 6 digits)',
    async () => {
      // BLOCKED: needs a production/staging target + a real authenticator
      // enrollment to test meaningfully. Rose flagged this asymmetry
      // explicitly. Un-skip once we have a safe non-financial way to exercise
      // this without touching real prod data.
    }
  );

  test.skip('PP-AUTH-04 OTP "Go back" returns to the username/password step', async () => {
    // Confirmed the link exists (loginPage.otpGoBackLink) - behavior (does it
    // clear the password field? re-require OTP on retry?) not yet confirmed.
  });

  test.skip('PP-AUTH-05 locks or rate-limits after repeated failed login attempts', async () => {
    // INFERRED requirement, not confirmed. Common in fintech panels but needs
    // Rose/product confirmation before we assert specific thresholds or lockout copy.
  });

  test.skip('PP-AUTH-06 language switcher toggles the sign-in screen to Français', async () => {
    // Confirmed the switcher offers English/Français (screenshot, 2026-09-09).
    // Not yet confirmed: does it persist across the OTP step and post-login,
    // or reset per session?
  });
});
