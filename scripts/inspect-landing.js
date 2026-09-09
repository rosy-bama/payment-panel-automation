/**
 * Ad-hoc DOM/screenshot inspector - NOT part of the test suite.
 *
 * Use this from a machine that can actually reach the target URL (this sandbox
 * couldn't - see README "Known limitation") to quickly capture a screenshot and
 * dump input field names/ids/placeholders for a page, so page objects in
 * src/pages/ can be corrected with real selectors instead of guesses.
 *
 * Usage:
 *   node scripts/inspect-landing.js [path]     e.g. node scripts/inspect-landing.js /dashboard
 *
 * Reads PP_BASE_URL/PP_USERNAME/PP_PASSWORD from .env (not required just to
 * screenshot the landing/login page).
 */
require('dotenv').config();
const { chromium } = require('playwright');

const path = process.argv[2] || '/';
const BASE_URL = process.env.PP_BASE_URL || 'https://testbox-payment-panel.ejara.tech/';
const target = new URL(path, BASE_URL).toString();
const outName = path.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'landing';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    console.log('Navigating to', target);
    await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30000 });

    require('fs').mkdirSync('scripts/output', { recursive: true });
    await page.screenshot({ path: `scripts/output/${outName}.png`, fullPage: true });
    require('fs').writeFileSync(`scripts/output/${outName}.html`, await page.content());

    const inputs = await page.$$eval('input, textarea, select', (els) =>
      els.map((el) => ({
        tag: el.tagName.toLowerCase(),
        name: el.name,
        id: el.id,
        type: el.type,
        placeholder: el.placeholder,
        ariaLabel: el.getAttribute('aria-label'),
      }))
    );
    console.log(`Saved scripts/output/${outName}.png and .html`);
    console.log('Form fields found:', JSON.stringify(inputs, null, 2));
  } catch (err) {
    console.error('Failed:', err.message);
  } finally {
    await browser.close();
  }
})();
