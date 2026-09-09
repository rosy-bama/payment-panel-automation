import { Page } from '@playwright/test';

/**
 * Fills the 6-box OTP input seen on both the login screen ("Check your
 * Authenticator App") and the Make Payment step-up challenge ("Confirm it's
 * you") - confirmed via screenshots 2026-09-09. Boxes render as two groups of
 * three digits separated by a dash, meaning this is a TOTP authenticator-app
 * code (not SMS/email OTP) - confirmed by the "Authenticator App" heading text.
 *
 * Each digit is its own <input>, so there's no single field to .fill(). The
 * selector below is a best guess (numeric/maxlength-1 inputs) since the real
 * DOM hasn't been inspected - confirm/adjust once run against the app.
 */
export async function fillOtpBoxes(page: Page, code: string) {
  if (!/^\d{6}$/.test(code)) {
    throw new Error(`OTP code must be exactly 6 digits, got "${code}"`);
  }

  const boxes = page.locator(
    'input[inputmode="numeric"], input[type="tel"], input[maxlength="1"]'
  );
  const count = await boxes.count();
  if (count !== 6) {
    throw new Error(
      `Expected 6 OTP box inputs, found ${count}. Update the selector in ` +
        `src/utils/otp.ts once the real DOM is confirmed (screenshot alone ` +
        `doesn't reveal input attributes).`
    );
  }

  for (let i = 0; i < 6; i++) {
    await boxes.nth(i).fill(code[i]);
  }
}
