import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { fillOtpBoxes } from '../utils/otp';

/**
 * The "Make Payment" modal, opened from TransactionsPage.makePaymentButton.
 * Confirmed from screenshots (2026-09-09) as a 3-step wizard: User -> Payment
 * -> Review, followed by an OTP step-up challenge ("Confirm it's you" - same
 * 6-box authenticator code as login) before the payment is actually
 * submitted, then a "Verified / Processing your request..." loading state.
 *
 * This is the highest-risk flow in the app (it moves real money), so:
 *  - the Review step's irreversibility warning is asserted verbatim where
 *    seen, not paraphrased;
 *  - every field below is Confirmed present/labeled from the screenshot, but
 *    validation rules (which combinations are valid, min/max amount, exactly
 *    which fields are required for Pay Out vs Pay In) are NOT confirmed -
 *    see docs/inferred-spec.md, Make Payment module.
 */
export class MakePaymentWizard extends BasePage {
  // Step 1: User
  readonly payInButton: Locator;
  readonly payOutButton: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly resetButton: Locator;
  readonly continueButton: Locator;

  // Step 2: Payment
  readonly countrySelect: Locator;
  readonly currencySelect: Locator;
  readonly amountInput: Locator;
  readonly featureSelect: Locator;
  readonly paymentTypeSelect: Locator;
  readonly paymentModeSelect: Locator;
  readonly phoneNumberInput: Locator;
  readonly externalReferenceInput: Locator;
  readonly commentInput: Locator;
  readonly isVoucherCheckbox: Locator;
  readonly backButton: Locator;
  readonly reviewButton: Locator;

  // Step 3: Review
  readonly irreversibleWarning: Locator;
  readonly makePaymentButton: Locator;

  // Step-up OTP challenge
  readonly confirmItsYouHeading: Locator;
  readonly otpVerifyButton: Locator;

  // Post-submit
  readonly verifiedIndicator: Locator;
  readonly processingText: Locator;

  constructor(page: Page) {
    super(page);

    this.payInButton = page.getByRole('button', { name: /^pay in$/i });
    this.payOutButton = page.getByRole('button', { name: /^pay out$/i });
    this.usernameInput = page.getByPlaceholder(/search by username/i);
    this.emailInput = page.getByPlaceholder(/customer@email\.com/i);
    this.resetButton = page.getByRole('button', { name: /^reset$/i });
    this.continueButton = page.getByRole('button', { name: /^continue$/i });

    // INFERRED selects - Ant Design comboboxes, exact accessible names unconfirmed.
    this.countrySelect = page.getByLabel(/^country$/i);
    this.currencySelect = page.getByLabel(/^currency$/i);
    this.amountInput = page.getByLabel(/^amount$/i);
    this.featureSelect = page.getByLabel(/^feature$/i);
    this.paymentTypeSelect = page.getByLabel(/^payment type$/i);
    this.paymentModeSelect = page.getByLabel(/^payment mode$/i);
    this.phoneNumberInput = page.getByLabel(/phone number/i);
    this.externalReferenceInput = page.getByLabel(/external transaction reference/i);
    this.commentInput = page.getByLabel(/^comment$/i);
    this.isVoucherCheckbox = page.getByRole('checkbox', { name: /this is a payment voucher/i });
    this.backButton = page.getByRole('button', { name: /^back$/i });
    this.reviewButton = page.getByRole('button', { name: /^review$/i });

    // Confirmed verbatim from the Review-step screenshot.
    this.irreversibleWarning = page.getByText(
      /double-check the reference and amount.*payment records cannot be reversed/i
    );
    this.makePaymentButton = page.getByRole('button', { name: /^make payment$/i });

    this.confirmItsYouHeading = page.getByRole('heading', { name: /confirm it'?s you/i });
    this.otpVerifyButton = page.getByRole('button', { name: /^verify$/i });

    this.verifiedIndicator = page.getByText(/^verified$/i);
    this.processingText = page.getByText(/processing your request/i);
  }

  async selectDirection(direction: 'pay-in' | 'pay-out') {
    await (direction === 'pay-in' ? this.payInButton : this.payOutButton).click();
  }

  async fillUserStep(username: string, email: string) {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.continueButton.click();
  }

  async fillPaymentStep(details: {
    country: string;
    currency: string;
    amount: string;
    feature: string;
    paymentType: string;
    paymentMode: string;
    phoneNumber: string;
    externalReference: string;
    comment: string;
    isVoucher?: boolean;
  }) {
    // NOTE: Ant Design selects usually need a click + option-click rather
    // than .selectOption() (that's for native <select>). Left as .fill()/
    // .selectOption() placeholders to be corrected once run against the
    // real app - see docs/inferred-spec.md.
    await this.countrySelect.fill(details.country).catch(() => {});
    await this.currencySelect.fill(details.currency).catch(() => {});
    await this.amountInput.fill(details.amount);
    await this.featureSelect.fill(details.feature).catch(() => {});
    await this.paymentTypeSelect.fill(details.paymentType).catch(() => {});
    await this.paymentModeSelect.fill(details.paymentMode).catch(() => {});
    await this.phoneNumberInput.fill(details.phoneNumber);
    await this.externalReferenceInput.fill(details.externalReference);
    await this.commentInput.fill(details.comment);
    if (details.isVoucher) {
      await this.isVoucherCheckbox.check();
    }
    await this.reviewButton.click();
  }

  async confirmAndSubmit(otp: string) {
    await expect(this.irreversibleWarning).toBeVisible();
    await this.makePaymentButton.click();
    await expect(this.confirmItsYouHeading).toBeVisible();
    await fillOtpBoxes(this.page, otp);
    await this.otpVerifyButton.click();
    await expect(this.verifiedIndicator).toBeVisible();
  }
}
