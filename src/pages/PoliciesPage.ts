import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Confirmed from screenshot (2026-09-09): three sub-tabs (Payout Approval
 * Policy / Payout Abuse Policy / Payin Abuse Policy), a "Filter by feature"
 * dropdown, "+ New Policy", and a table (Id, Created At, From, To, Required
 * Approvals, Feature, Status, Created By, Updated By, Updated At). The "New
 * Payout Approval Policy" drawer has From* and To* (numeric), Required
 * Approvals* (numeric), Feature* (dropdown). These policies gate payout
 * amounts behind N approvals per feature/amount band - high business risk if
 * wrong, since it's literally fraud/compliance control. See
 * docs/inferred-spec.md, Policies module.
 */
export class PoliciesPage extends BasePage {
  readonly heading: Locator;
  readonly payoutApprovalTab: Locator;
  readonly payoutAbuseTab: Locator;
  readonly payinAbuseTab: Locator;
  readonly filterByFeature: Locator;
  readonly newPolicyButton: Locator;
  readonly table: Locator;

  // New Payout Approval Policy drawer
  readonly fromInput: Locator;
  readonly toInput: Locator;
  readonly requiredApprovalsInput: Locator;
  readonly featureSelect: Locator;
  /** Creates a payout policy: changes the panel's configuration (PP_ALLOW_SETTINGS_CHANGES=true, testbox only). @changesState */
  readonly createPolicyButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /^policies$/i });
    this.payoutApprovalTab = page.getByRole('tab', { name: /payout approval policy/i });
    this.payoutAbuseTab = page.getByRole('tab', { name: /payout abuse policy/i });
    this.payinAbuseTab = page.getByRole('tab', { name: /payin abuse policy/i });
    this.filterByFeature = page.getByPlaceholder(/filter by feature/i);
    this.newPolicyButton = page.getByRole('button', { name: /new policy/i });
    this.table = page.getByRole('table');

    this.fromInput = page.getByLabel(/^from$/i);
    this.toInput = page.getByLabel(/^to$/i);
    this.requiredApprovalsInput = page.getByLabel(/required approvals/i);
    this.featureSelect = page.getByLabel(/^feature$/i);
    this.createPolicyButton = page.getByRole('button', { name: /create policy/i });
  }

  async goto() {
    await super.goto('/policies');
  }
}
