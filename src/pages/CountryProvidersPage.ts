import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Confirmed from screenshot (2026-09-09): four stat cards (Total Configs,
 * Live Configs [with "N in test" subtext], Countries, Providers), filter
 * pills (All/Pay in/Pay out), Country/Provider filter dropdowns, a "Switch
 * Live" button (INFERRED - likely toggles the table between Live and Test
 * environment rows; unconfirmed), "+ New Config", and a wide table (Id,
 * Country/Provider, Payment Mode, Transaction Type, Customer Type,
 * Environment [Live/Test badge], Fees, Ejara Fees, Min/Max Amount, Feature,
 * Gateway, Automatic, Require OTP, Date Created/Updated).
 *
 * "New Country Provider" drawer is the richest form in the app: Country*,
 * Payment Provider*, Payment Mode*, Transaction Type*, Feature (optional),
 * Customer Type (optional), Payment Gateway* (free text, e.g.
 * "account_to_wallet"), Fees Policy* + Fees Value*, Ejara Fees Policy* +
 * Ejara Fees Value*, Min/Max Amount (optional), OTP Code USSD (optional),
 * Payment USSD (optional), and three toggles: "Require OTP" (customer must
 * enter OTP to complete payment), "Require Browser" (payment flow needs a
 * browser - 3-DS/redirect), "Sync with Nellys Coin". This form controls
 * live money-movement rules per country/provider - highest-risk config
 * screen in the app. See docs/inferred-spec.md, Country Providers module.
 */
export class CountryProvidersPage extends BasePage {
  readonly heading: Locator;
  readonly totalConfigsStat: Locator;
  readonly liveConfigsStat: Locator;
  readonly countriesStat: Locator;
  readonly providersStat: Locator;
  readonly allFilter: Locator;
  readonly payInFilter: Locator;
  readonly payOutFilter: Locator;
  readonly switchLiveButton: Locator;
  readonly newConfigButton: Locator;
  readonly table: Locator;

  // New Country Provider drawer
  readonly countrySelect: Locator;
  readonly paymentProviderSelect: Locator;
  readonly paymentModeSelect: Locator;
  readonly transactionTypeSelect: Locator;
  readonly featureSelect: Locator;
  readonly customerTypeSelect: Locator;
  readonly paymentGatewayInput: Locator;
  readonly feesPolicySelect: Locator;
  readonly feesValueInput: Locator;
  readonly ejaraFeesPolicySelect: Locator;
  readonly ejaraFeesValueInput: Locator;
  readonly minAmountInput: Locator;
  readonly maxAmountInput: Locator;
  readonly otpCodeUssdInput: Locator;
  readonly paymentUssdInput: Locator;
  readonly requireOtpToggle: Locator;
  readonly requireBrowserToggle: Locator;
  readonly syncWithNellysCoinToggle: Locator;
  readonly createConfigButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /country provider/i });
    this.totalConfigsStat = page.getByText(/total configs/i);
    this.liveConfigsStat = page.getByText(/live configs/i);
    this.countriesStat = page.getByText(/^countries$/i);
    this.providersStat = page.getByText(/^providers$/i);
    this.allFilter = page.getByText(/^all\s/i);
    this.payInFilter = page.getByText(/^pay in\s/i);
    this.payOutFilter = page.getByText(/^pay out\s/i);
    this.switchLiveButton = page.getByRole('button', { name: /switch live/i });
    this.newConfigButton = page.getByRole('button', { name: /new config/i });
    this.table = page.getByRole('table');

    this.countrySelect = page.getByLabel(/^country$/i);
    this.paymentProviderSelect = page.getByLabel(/payment provider/i);
    this.paymentModeSelect = page.getByLabel(/^payment mode$/i);
    this.transactionTypeSelect = page.getByLabel(/transaction type/i);
    this.featureSelect = page.getByLabel(/^feature$/i);
    this.customerTypeSelect = page.getByLabel(/customer type/i);
    this.paymentGatewayInput = page.getByPlaceholder(/account_to_wallet/i);
    this.feesPolicySelect = page.getByLabel(/^fees policy$/i);
    this.feesValueInput = page.getByPlaceholder(/e\.g\. 0\.06/i);
    this.ejaraFeesPolicySelect = page.getByLabel(/ejara fees policy/i);
    this.ejaraFeesValueInput = page.getByPlaceholder(/e\.g\. 0\.03/i);
    this.minAmountInput = page.getByPlaceholder(/e\.g\. 10\.\.\./i);
    this.maxAmountInput = page.getByPlaceholder(/e\.g\. 100\.\.\./i);
    this.otpCodeUssdInput = page.getByLabel(/otp code ussd/i);
    this.paymentUssdInput = page.getByLabel(/^payment ussd$/i);
    this.requireOtpToggle = page
      .getByText(/^require otp$/i)
      .locator('..')
      .getByRole('switch');
    this.requireBrowserToggle = page
      .getByText(/^require browser$/i)
      .locator('..')
      .getByRole('switch');
    this.syncWithNellysCoinToggle = page
      .getByText(/sync with nellys coin/i)
      .locator('..')
      .getByRole('switch');
    this.createConfigButton = page.getByRole('button', { name: /create config/i });
  }

  async goto() {
    await super.goto('/country-providers');
  }
}
