import { Page } from '@playwright/test';

/**
 * Shared behavior for every page object.
 * NOTE ON SELECTORS: since the Payment Panel has no written spec, every locator below
 * is a best-effort placeholder based on convention (role/label/text) rather than a
 * confirmed data-testid. Swap in real selectors as we confirm them against the live
 * DOM (screenshots + your HTML snippets), and prefer data-testid if the app has them -
 * ask the dev team if attributes like that exist before we lock in fragile CSS selectors.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async screenshot(name: string) {
    await this.page.screenshot({ path: `test-results/manual/${name}.png`, fullPage: true });
  }

  async currentUrl() {
    return this.page.url();
  }
}
