import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Confirmed from screenshot (2026-09-09): filter pills (All/Active/
 * Inactive with counts), search by name, "+ New Provider", table (Id,
 * Provider Name, Status, Description, Created By, Updated By, Date
 * Created, Date Updated). "New Provider" drawer: Name*, Description*, an
 * "Active" toggle (ON by default - "Provider is available for transactions
 * right away"), and a "Sync with Nellys Coin" toggle (OFF by default).
 * Nellys Coin appears to be a related Ejara product these config screens
 * can mirror into - unconfirmed what breaks if left on/off; treat as OFF
 * in tests unless told otherwise (see docs/inferred-spec.md open questions).
 */
export class ProvidersPage extends BasePage {
  readonly heading: Locator;
  readonly allFilter: Locator;
  readonly activeFilter: Locator;
  readonly inactiveFilter: Locator;
  readonly searchInput: Locator;
  readonly newProviderButton: Locator;
  readonly table: Locator;

  // New Provider drawer
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly activeToggle: Locator;
  readonly syncWithNellysCoinToggle: Locator;
  /** Creates a provider: changes the panel's configuration (PP_ALLOW_SETTINGS_CHANGES=true, testbox only). @changesState */
  readonly createProviderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /^provider$/i });
    this.allFilter = page.getByText(/^all\s/i);
    this.activeFilter = page.getByText(/^active\s/i);
    this.inactiveFilter = page.getByText(/^inactive\s/i);
    this.searchInput = page.getByPlaceholder(/search by name/i);
    this.newProviderButton = page.getByRole('button', { name: /new provider/i });
    this.table = page.getByRole('table');

    this.nameInput = page.getByLabel(/^name$/i);
    this.descriptionInput = page.getByLabel(/^description$/i);
    this.activeToggle = page.getByText(/^active$/i).locator('..').getByRole('switch');
    this.syncWithNellysCoinToggle = page
      .getByText(/sync with nellys coin/i)
      .locator('..')
      .getByRole('switch');
    this.createProviderButton = page.getByRole('button', { name: /create provider/i });
  }

  async goto() {
    await super.goto('/providers');
  }
}
