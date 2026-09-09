import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { fillOtpBoxes } from '../utils/otp';

/**
 * Confirmed from screenshots (2026-09-09):
 * - Sign-in screen: "Username" / "Password" fields (Ant Design Form.Item
 *   style, red required asterisk), placeholder "Enter your username", a
 *   password show/hide toggle, and a "Sign in" button.
 * - OTP screen: heading "Check your Authenticator App" (this is TOTP via an
 *   authenticator app, not SMS/email), subtext "Enter the 6-digit code below
 *   to complete your sign in.", a 6-box code input (3-3 split with a dash),
 *   a "Go back" link, and a "Verify and sign in" button.
 * - Language switcher (top-right) offers English and Français.
 *
 * The app is a React SPA (Vite build, Ant Design + Chakra UI bundles) - there
 * is no server-rendered HTML to inspect via "view source"; only the mounted
 * <div id="root"> content (screenshot or DevTools "Inspect Element") reflects
 * real fields. Locators prefer placeholder/role/label/text (stable regardless
 * of framework) over CSS classes.
 *
 * Still unconfirmed: exact password field placeholder (masked in the
 * screenshot), the 6 OTP box inputs' actual DOM attributes (see
 * src/utils/otp.ts), and error message copy.
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly languageSwitcher: Locator;

  readonly otpHeading: Locator;
  readonly otpGoBackLink: Locator;
  readonly otpVerifyButton: Locator;

  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.getByPlaceholder(/enter your username/i);
    this.passwordInput = page
      .getByPlaceholder(/enter your password/i)
      .or(page.getByLabel(/password/i))
      .or(page.locator('input[type="password"]'));
    this.loginButton = page.getByRole('button', { name: /^sign in$/i });

    this.languageSwitcher = page.getByText(/english|français/i).first();

    // Confirmed copy from the OTP screenshot.
    this.otpHeading = page.getByRole('heading', { name: /check your authenticator app/i });
    this.otpGoBackLink = page.getByText(/go back/i);
    // Matches both "Verify and sign in" (login) and "Verify" (payment step-up).
    this.otpVerifyButton = page.getByRole('button', { name: /^verify/i });

    // INFERRED - exact error copy not yet seen.
    this.errorMessage = page.getByText(/invalid|incorrect|error/i);
  }

  async goto() {
    await super.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async submitOtp(otp: string) {
    await expect(this.otpHeading).toBeVisible();
    await fillOtpBoxes(this.page, otp);
    await this.otpVerifyButton.click();
  }

  async expectLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }
}
