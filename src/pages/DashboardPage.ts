import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Confirmed from screenshot (2026-09-09): Dashboard shows an "in development"
 * banner (live metrics not wired up) listing what's coming next, and an
 * "Available sections" grid of cards linking to the parts that already work:
 * Transactions (Overview), Accounts (Ejara Pay Admin), Transactions (Ejara
 * Pay Admin) [sic - duplicate label, two different destinations per the
 * screenshot], Policies / Providers / Country Providers / Payment Mode
 * (Settings). "Accounts" isn't visible in the sidebar (lives under the
 * collapsed "Ejara Pay Admin" group) - see docs/inferred-spec.md open
 * questions.
 */
export class DashboardPage extends BasePage {
  readonly heading: Locator;
  readonly inDevelopmentBadge: Locator;
  readonly availableSectionsHeading: Locator;
  readonly accountsCard: Locator;
  readonly transactionsOverviewCard: Locator;
  readonly policiesCard: Locator;
  readonly providersCard: Locator;
  readonly countryProvidersCard: Locator;
  readonly paymentModeCard: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /^dashboard$/i });
    this.inDevelopmentBadge = page.getByText(/in development/i);
    this.availableSectionsHeading = page.getByRole('heading', { name: /available sections/i });
    this.accountsCard = page.getByRole('link', { name: /accounts/i });
    this.transactionsOverviewCard = page.getByRole('link', { name: /transactions.*overview/i });
    this.policiesCard = page.getByRole('link', { name: /policies/i });
    this.providersCard = page.getByRole('link', { name: /^providers/i });
    this.countryProvidersCard = page.getByRole('link', { name: /country providers/i });
    this.paymentModeCard = page.getByRole('link', { name: /payment mode/i });
  }

  async goto() {
    await super.goto('/dashboard');
  }
}
