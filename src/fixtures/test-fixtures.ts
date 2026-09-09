import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NavSidebar } from '../pages/NavSidebar';
import { DashboardPage } from '../pages/DashboardPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { MakePaymentWizard } from '../pages/MakePaymentWizard';
import { PoliciesPage } from '../pages/PoliciesPage';
import { ProvidersPage } from '../pages/ProvidersPage';
import { CountryProvidersPage } from '../pages/CountryProvidersPage';
import { PaymentModePage } from '../pages/PaymentModePage';

type Fixtures = {
  loginPage: LoginPage;
  nav: NavSidebar;
  dashboardPage: DashboardPage;
  transactionsPage: TransactionsPage;
  makePaymentWizard: MakePaymentWizard;
  policiesPage: PoliciesPage;
  providersPage: ProvidersPage;
  countryProvidersPage: CountryProvidersPage;
  paymentModePage: PaymentModePage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  nav: async ({ page }, use) => use(new NavSidebar(page)),
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  transactionsPage: async ({ page }, use) => use(new TransactionsPage(page)),
  makePaymentWizard: async ({ page }, use) => use(new MakePaymentWizard(page)),
  policiesPage: async ({ page }, use) => use(new PoliciesPage(page)),
  providersPage: async ({ page }, use) => use(new ProvidersPage(page)),
  countryProvidersPage: async ({ page }, use) => use(new CountryProvidersPage(page)),
  paymentModePage: async ({ page }, use) => use(new PaymentModePage(page)),
});

export { expect } from '@playwright/test';
