import { test, expect } from '../../src/fixtures/test-fixtures';

/**
 * Cross-module navigation smoke check - one assertion per sidebar item that
 * it lands on a page with the right heading. See docs/inferred-spec.md,
 * Navigation & Layout module, for what's confirmed about the sidebar
 * structure (Overview: Dashboard/Transactions; collapsed "Ejara Pay Admin"
 * group; Settings: Policies/Providers/Country Providers/Payment Mode).
 */
test.describe('Navigation @smoke', () => {
  test('PP-NAV-01 Dashboard loads and greets the user', async ({ page, dashboardPage, nav }) => {
    await dashboardPage.goto();
    await expect(dashboardPage.heading).toBeVisible();
    await expect(nav.welcomeText).toBeVisible();
  });

  test('PP-NAV-02 sidebar links reach Transactions, Policies, Providers, Country Providers, Payment Mode', async ({
    nav,
    transactionsPage,
    policiesPage,
    providersPage,
    countryProvidersPage,
    paymentModePage,
  }) => {
    await nav.transactionsLink.click();
    await expect(transactionsPage.heading).toBeVisible();

    await nav.policiesLink.click();
    await expect(policiesPage.heading).toBeVisible();

    await nav.providersLink.click();
    await expect(providersPage.heading).toBeVisible();

    await nav.countryProvidersLink.click();
    await expect(countryProvidersPage.heading).toBeVisible();

    await nav.paymentModeLink.click();
    await expect(paymentModePage.heading).toBeVisible();
  });

  test.skip('PP-NAV-03 "Ejara Pay Admin" group expands to reveal an Accounts view', async () => {
    // Dashboard has an "Accounts" card (Ejara Pay Admin) but the sidebar
    // group is collapsed by default and its contents haven't been confirmed
    // yet. Un-skip once we've seen it expanded.
  });
});
