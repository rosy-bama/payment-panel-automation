import { test, expect } from '../../src/fixtures/test-fixtures';

/**
 * Transactions module - see docs/inferred-spec.md for full details. Layout
 * (stat cards, status tabs, table columns, pagination) is Confirmed from
 * screenshot; filtering/search/export *behavior* is not, so those cases are
 * skipped pending a live run.
 */
test.describe('Transactions', () => {
  test('PP-TXN-01 page loads with all-time stat cards and status tabs', async ({ transactionsPage }) => {
    await transactionsPage.goto();
    await expect(transactionsPage.heading).toBeVisible();
    await expect(transactionsPage.totalVolumeStat).toBeVisible();
    await expect(transactionsPage.transactionsCountStat).toBeVisible();
    await expect(transactionsPage.successRateStat).toBeVisible();
    await expect(transactionsPage.avgCompletionTimeStat).toBeVisible();
    await expect(transactionsPage.uniqueCustomersStat).toBeVisible();
  });

  test('PP-TXN-02 Make Payment button is visible and opens the wizard', async ({
    transactionsPage,
    makePaymentWizard,
  }) => {
    await transactionsPage.goto();
    await transactionsPage.makePaymentButton.click();
    await expect(makePaymentWizard.payInButton).toBeVisible();
    await expect(makePaymentWizard.payOutButton).toBeVisible();
  });

  test.skip('PP-TXN-03 status tab counts match the table when filtered (e.g. Rejected -> 76 rows total)', async () => {
    // INFERRED that clicking a tab filters the table by that status - visually
    // very likely given the pill/count UI, but not yet confirmed live.
  });

  test.skip('PP-TXN-04 date range controls (7d/30d/60d/90d, Daily grouping, calendar) change the stat cards', async () => {
    // Confirmed the controls exist; not confirmed what "All time" vs a
    // selected range actually changes, or whether stat cards update live.
  });

  test.skip('PP-TXN-05 search by keyword filters the table (e.g. by username or internal ref)', async () => {
    // Confirmed the search box exists; matching behavior (username only?
    // internal ref too? partial match?) unconfirmed.
  });

  test.skip('PP-TXN-06 export/download produces a file matching the current filter', async () => {
    // Confirmed the icon exists; format (CSV/XLSX) and scope (current page
    // vs full filtered set) unconfirmed.
  });
});
