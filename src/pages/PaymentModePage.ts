import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Confirmed from screenshot (2026-09-09): filter pills (All/Active/Inactive),
 * search by code or description, "+ New Payment Mode", table (Id, Code,
 * Description, Payment Type, Funding Source [Bank/Mobile Money badge],
 * Status, Created By, Updated By, Date Created, Date Updated). "New Payment
 * Mode" drawer requires BOTH English and French titles/descriptions
 * (Title (EN)*, Title (FR)*, Description (EN), Description (FR)) - confirms
 * bilingual data entry is a first-class concern here, worth its own test
 * (e.g. cannot submit with only one language filled). Also has the same
 * "Sync with Nellys Coin" toggle seen on Providers/Country Providers.
 */
export class PaymentModePage extends BasePage {
  readonly heading: Locator;
  readonly allFilter: Locator;
  readonly activeFilter: Locator;
  readonly inactiveFilter: Locator;
  readonly filterByPaymentType: Locator;
  readonly searchInput: Locator;
  readonly newPaymentModeButton: Locator;
  readonly table: Locator;

  // New Payment Mode drawer
  readonly codeInput: Locator;
  readonly titleEnInput: Locator;
  readonly titleFrInput: Locator;
  readonly fundingSourceSelect: Locator;
  readonly paymentTypeSelect: Locator;
  readonly descriptionEnInput: Locator;
  readonly descriptionFrInput: Locator;
  readonly syncWithNellysCoinToggle: Locator;
  readonly createPaymentModeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /^payment mode$/i });
    this.allFilter = page.getByText(/^all\s/i);
    this.activeFilter = page.getByText(/^active\s/i);
    this.inactiveFilter = page.getByText(/^inactive\s/i);
    this.filterByPaymentType = page.getByPlaceholder(/filter by payment type/i);
    this.searchInput = page.getByPlaceholder(/search by code or description/i);
    this.newPaymentModeButton = page.getByRole('button', { name: /new payment mode/i });
    this.table = page.getByRole('table');

    this.codeInput = page.getByPlaceholder(/e\.g\. 10001/i);
    this.titleEnInput = page.getByPlaceholder(/e\.g\. bank transfer/i);
    this.titleFrInput = page.getByPlaceholder(/e\.g\. virement bancaire/i);
    this.fundingSourceSelect = page.getByLabel(/funding source/i);
    this.paymentTypeSelect = page.getByLabel(/^payment type$/i);
    this.descriptionEnInput = page.getByPlaceholder(/what does this payment mode cover/i);
    this.descriptionFrInput = page.getByPlaceholder(/que couvre ce mode de paiement/i);
    this.syncWithNellysCoinToggle = page
      .getByText(/sync with nellys coin/i)
      .locator('..')
      .getByRole('switch');
    this.createPaymentModeButton = page.getByRole('button', { name: /create payment mode/i });
  }

  async goto() {
    await super.goto('/payment-mode');
  }
}
