import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Confirmed from screenshot (2026-09-09). Header: "All-time global
 * transactions across every region and currency". Controls: date grouping
 * ("Daily"), quick ranges (7d/30d/60d/90d), a calendar picker, "+ Make
 * Payment", and a refresh icon. Five all-time stat cards. Status filter
 * pills with live counts: All / Initiated / Confirmed / Rejected / Awaiting
 * Approval. Table columns: Id, Created At, Username (+ phone + country),
 * Status, Transaction Type (Pay in/Pay out), Paid Amount, Raw Amount, Global
 * Fees, Provider, Payment Mode, Feature, Internal Ref. Paginated, 10/page
 * shown, page-size selector.
 */
export class TransactionsPage extends BasePage {
  readonly heading: Locator;
  readonly makePaymentButton: Locator;
  readonly refreshButton: Locator;

  readonly totalVolumeStat: Locator;
  readonly transactionsCountStat: Locator;
  readonly successRateStat: Locator;
  readonly avgCompletionTimeStat: Locator;
  readonly uniqueCustomersStat: Locator;

  readonly allTab: Locator;
  readonly initiatedTab: Locator;
  readonly confirmedTab: Locator;
  readonly rejectedTab: Locator;
  readonly awaitingApprovalTab: Locator;

  readonly searchInput: Locator;
  readonly filterButton: Locator;
  readonly exportButton: Locator;

  readonly table: Locator;
  readonly pageSizeSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /^transactions$/i });
    this.makePaymentButton = page.getByRole('button', { name: /make payment/i });
    this.refreshButton = page.getByRole('button', { name: /refresh|reload/i });

    this.totalVolumeStat = page.getByText(/total volume/i);
    this.transactionsCountStat = page.getByText(/^transactions$/i);
    this.successRateStat = page.getByText(/success rate/i);
    this.avgCompletionTimeStat = page.getByText(/avg completion time/i);
    this.uniqueCustomersStat = page.getByText(/unique customers/i);

    // INFERRED - tab labels include a live count (e.g. "Confirmed 1212");
    // matching the leading word keeps this stable as counts change.
    this.allTab = page.getByRole('tab', { name: /^all/i }).or(page.getByText(/^all\s/i));
    this.initiatedTab = page.getByText(/^initiated/i);
    this.confirmedTab = page.getByText(/^confirmed/i);
    this.rejectedTab = page.getByText(/^rejected/i);
    this.awaitingApprovalTab = page.getByText(/^awaiting approval/i);

    this.searchInput = page.getByPlaceholder(/search by keyword/i);
    this.filterButton = page.getByRole('button', { name: /^filter$/i });
    this.exportButton = page.getByRole('button', { name: /export|download/i });

    this.table = page.getByRole('table');
    this.pageSizeSelect = page.getByText(/^showing$/i).locator('..').getByRole('combobox');
  }

  async goto() {
    await super.goto('/transactions');
  }

  /** Row locator by transaction Id (first column) - INFERRED table structure. */
  rowById(id: string | number) {
    return this.table.getByRole('row', { name: new RegExp(`^${id}\\b`) });
  }
}
