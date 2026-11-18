import { test, expect } from '../../src/fixtures/test-fixtures';
import { env } from '../../src/utils/env';

/**
 * Make Payment - the core money-movement flow, and the highest-risk area of
 * this app. Full writeup in docs/inferred-spec.md, "Make Payment" module.
 *
 * Confirmed 3-step wizard (User -> Payment -> Review) from screenshots
 * (2026-09-09), reusing the same "rosetest" / "roseejaratestmail@gmail.com"
 * test identity and CNPS-contributions/MTN-Mobile-Money combination Rose
 * demoed. An OTP step-up challenge gates final submission, and the Review
 * step shows a verbatim irreversibility warning. None of this has been run
 * against the live app from this sandbox (no network access - see README),
 * so every test below is either skipped with a clear reason or written to
 * fail loudly/informatively rather than silently pass on a wrong assumption.
 *
 * IMPORTANT - do not run PAY-01/PAY-02 against testbox without checking with
 * Rose first whether "make a real payment" on testbox has any side effects
 * worth avoiding (it already has ~1300 transactions and real-looking test
 * customers, so probably fine, but confirm before running unattended in CI).
 */
test.describe('Make Payment @smoke', () => {
  test.skip(
    'PP-PAY-01 happy path: Pay In with valid details reaches Review, submits after OTP, and shows Verified',
    async ({ transactionsPage, makePaymentWizard }) => {
      // BLOCKED: needs a live run to confirm the Ant Design select interactions
      // (fillPaymentStep uses .fill() as a placeholder - antd comboboxes
      // usually need click-then-pick-option instead). Un-skip once corrected.
      await transactionsPage.goto();
      await transactionsPage.makePaymentButton.click();

      await makePaymentWizard.selectDirection('pay-in');
      await makePaymentWizard.fillUserStep('rosetest', 'roseejaratestmail@gmail.com');

      await makePaymentWizard.fillPaymentStep({
        country: 'Cameroon',
        currency: 'XAF',
        amount: '1000',
        feature: 'For CNPS contributions',
        paymentType: 'Mobile Money',
        paymentMode: 'MTN Mobile Money',
        phoneNumber: '680320121',
        externalReference: `AUTOTEST-${Date.now()}`,
        comment: 'Automated test payment',
      });

      await makePaymentWizard.confirmAndSubmit(env.otp);
      await expect(makePaymentWizard.processingText).toBeVisible();
    }
  );

  test.skip('PP-PAY-02 Review step shows the exact irreversibility warning before submission', async () => {
    // Confirmed verbatim copy (screenshot): "Double-check the reference and
    // amount — payment records cannot be reversed." Asserted inside
    // confirmAndSubmit() above; kept here as a standalone case too since a
    // fintech reviewer will likely want this checked independent of a full
    // successful submission.
  });

  test.skip('PP-PAY-03 Continue is disabled on step 1 until direction + username + email are filled', async () => {
    // INFERRED from screenshot sequence (button visibly disabled/grey before
    // fields filled, enabled after) - not yet confirmed which combination of
    // fields is the actual trigger (e.g. is email format validated?).
  });

  test.skip('PP-PAY-04 Review is disabled on step 2 until External Reference and Comment are filled', async () => {
    // INFERRED same way as above (screenshot showed Review greyed out with
    // those two fields empty, enabled once filled in a later screenshot).
  });

  test.skip('PP-PAY-05 OTP step-up: incorrect code on Make Payment is rejected and no transaction is created', async () => {
    // INFERRED - mirrors the login OTP asymmetry (testbox permissive, prod
    // must reject). Needs confirmation this challenge behaves the same way,
    // and needs a way to verify "no transaction created" (e.g. check
    // Transactions table count before/after).
  });

  test.skip('PP-PAY-06 Pay Out direction shows the same step 2/3 fields as Pay In', async () => {
    // Only Pay In was demoed in the screenshots. Confirm Pay Out doesn't add
    // extra required fields (e.g. destination account details) before
    // assuming the fillPaymentStep() shape covers both directions.
  });

  test.skip('PP-PAY-07 "This is a payment voucher" checkbox changes step 3 Review/behavior', async () => {
    // Checkbox exists (screenshot) but its effect is entirely unconfirmed.
  });

  test.skip('PP-PAY-08 amount below/above the country-provider min/max is rejected with a clear error', async () => {
    // INFERRED - Country Providers config sets Min/Max Amount per config
    // (see docs/inferred-spec.md, Country Providers module). Needs a known
    // config's bounds to test meaningfully (e.g. from the Country Providers
    // table) plus confirmation of the actual error copy/behavior.
  });

  test.skip('PP-PAY-09 a successful payment appears in the Transactions table with matching amount/reference', async () => {
    // Cross-module check tying Make Payment to TransactionsPage - valuable
    // end-to-end case once individual steps are confirmed working.
  });
});
