import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Confirmed from Dashboard screenshot (2026-09-09): left sidebar has an
 * "Overview" group (Dashboard, Transactions), a collapsible "Ejara Pay Admin"
 * group (collapsed by default - contents unconfirmed, but the Dashboard's
 * "Accounts" card suggests it holds at least an Accounts view), and a
 * "Settings" group (Policies, Providers, Country Providers, Payment Mode).
 * Top bar: sidebar collapse toggle, "Welcome back, <name>", global search
 * ("Search panel... ⌘K"), notification bell, user avatar (initials).
 */
export class NavSidebar extends BasePage {
  readonly dashboardLink: Locator;
  readonly transactionsLink: Locator;
  readonly ejaraPayAdminGroup: Locator;
  readonly policiesLink: Locator;
  readonly providersLink: Locator;
  readonly countryProvidersLink: Locator;
  readonly paymentModeLink: Locator;

  readonly welcomeText: Locator;
  readonly globalSearch: Locator;
  readonly notificationsBell: Locator;
  readonly userAvatar: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardLink = page.getByRole('link', { name: /^dashboard$/i });
    this.transactionsLink = page.getByRole('link', { name: /^transactions$/i });
    this.ejaraPayAdminGroup = page.getByText(/ejara pay admin/i);
    this.policiesLink = page.getByRole('link', { name: /^policies$/i });
    this.providersLink = page.getByRole('link', { name: /^providers$/i });
    this.countryProvidersLink = page.getByRole('link', { name: /^country providers$/i });
    this.paymentModeLink = page.getByRole('link', { name: /^payment mode$/i });

    this.welcomeText = page.getByText(/welcome back/i);
    this.globalSearch = page.getByPlaceholder(/search panel/i);
    this.notificationsBell = page.getByRole('button', { name: /notification/i });
    this.userAvatar = page.getByText(/^RB$/); // INFERRED - initials shown for Rose's testbox account specifically; will differ per user.
  }
}
