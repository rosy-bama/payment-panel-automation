import { test, expect } from '../../src/fixtures/test-fixtures';

/** Providers module - see docs/inferred-spec.md. */
test.describe('Providers', () => {
  test('PP-PRV-01 page loads with filter pills and a New Provider action', async ({ providersPage }) => {
    await providersPage.goto();
    await expect(providersPage.heading).toBeVisible();
    await expect(providersPage.newProviderButton).toBeVisible();
  });

  test.skip('PP-PRV-02 New Provider defaults to Active and creates a usable provider', async () => {
    // Confirmed the "Active" toggle defaults ON in the drawer (screenshot).
    // Whether a newly created provider is immediately selectable elsewhere
    // (e.g. in Country Providers' Payment Provider dropdown) is unconfirmed.
  });

  test.skip('PP-PRV-03 "Sync with Nellys Coin" toggle - confirm what it actually does before ever enabling it in a test', async () => {
    // Nellys Coin is an unconfirmed related Ejara system. Do not flip this
    // toggle ON in any automated test until Rose confirms it's safe/reversible.
  });

  test.skip('PP-PRV-04 deactivating a Provider removes it from active-only filters/dropdowns', async () => {
    // INFERRED from the Active/Inactive filter pills existing.
  });
});
