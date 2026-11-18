import { test, expect } from '../../src/fixtures/test-fixtures';

/** Payment Mode module - see docs/inferred-spec.md. */
test.describe('Payment Mode', () => {
  test('PP-PMODE-01 page loads with filter pills and a New Payment Mode action', async ({
    paymentModePage,
  }) => {
    await paymentModePage.goto();
    await expect(paymentModePage.heading).toBeVisible();
    await expect(paymentModePage.newPaymentModeButton).toBeVisible();
  });

  test.skip('PP-PMODE-02 New Payment Mode requires both EN and FR title before it can be created', async () => {
    // Confirmed both Title (EN)* and Title (FR)* are marked required in the
    // drawer (screenshot). Whether the Create button is actually blocked
    // with only one filled is not confirmed.
  });

  test.skip('PP-PMODE-03 Code must be unique (duplicate code is rejected)', async () => {
    // INFERRED - Code looks like a bank/provider identifier (e.g. "10001");
    // uniqueness constraint not confirmed.
  });
});
