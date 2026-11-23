# Payment Panel Automation

Playwright + TypeScript test automation for Ejara's Payment Panel (web).

Built without a written specification. Everything the tests assert is either
**confirmed** with the product/QA team or clearly marked **inferred**. See
[`docs/inferred-spec.md`](./docs/inferred-spec.md) for the full module-by-module
breakdown — read that before trusting any specific assertion in this suite.

## Setup

```bash
npm install
npx playwright install chromium   # if browsers aren't already present
cp .env.example .env              # then fill in real values
npm test
```

## Structure

```
src/
  pages/        Page Object Model classes (one per screen/module):
                  LoginPage, NavSidebar, DashboardPage, TransactionsPage,
                  MakePaymentWizard, PoliciesPage, ProvidersPage,
                  CountryProvidersPage, PaymentModePage
  fixtures/     Custom Playwright test fixtures (auto-wire all page objects)
  utils/        env loading, otp.ts (fills the 6-box authenticator code UI
                used by both login and the Make Payment step-up challenge)
tests/
  auth.setup.ts       Logs in once, saves session to .auth/state.json
  auth/               Authentication module specs
  smoke/              Cross-module navigation checks
  transactions/       Transactions list specs
  payments/           Make Payment wizard specs (highest-risk flow - money movement)
  settings/           Policies, Providers, Country Providers, Payment Mode specs
docs/
  inferred-spec.md    Reconstructed spec + test plan, confirmed vs. inferred,
                      module by module - read this first
```

## Conventions

- **Page Object Model**: no raw selectors in test files; everything goes through
  a class in `src/pages/`.
- **Secrets**: only in `.env` (gitignored). Never hardcode credentials in test
  files or page objects.
- **Tags**: `@smoke` for the fast, must-pass-every-build subset. Run with
  `npm run test:smoke`.
- **Unconfirmed behavior**: write the test, mark it `test.skip(...)`, and add a
  `// INFERRED` or `BLOCKED:` comment explaining what's missing. Don't assert
  guessed business rules as if they were confirmed — that produces false
  failures (or worse, false passes) once real behavior is known.
- **New module workflow**: screenshot/describe the screen → add a section to
  `docs/inferred-spec.md` → add a page object → add specs, skipped where the
  expected result isn't confirmed yet.

## Ad-hoc page inspection

`scripts/inspect-landing.js` is a standalone helper (not part of the test
suite) for capturing a screenshot + DOM dump of any page, from a machine that
can actually reach the target:

```bash
node scripts/inspect-landing.js /dashboard
```

Output goes to `scripts/output/` (gitignored). Use it to correct the guessed
selectors in `src/pages/` with real ones.

## Known limitation

This project was scaffolded in an environment with no network access to
`testbox-payment-panel.ejara.tech`, so none of the selectors below have been
verified against the live DOM yet. Treat every locator in `src/pages/` as a
draft until it's been run once against the real app and adjusted. In
particular, several fields documented as "dropdowns" (Country, Feature,
Payment Type/Mode, Fees Policy, etc.) are almost certainly Ant Design
`Select` components, which need a click-to-open + click-an-option
interaction rather than `.fill()`/`.selectOption()` — `MakePaymentWizard.
fillPaymentStep()` uses `.fill()` as a placeholder specifically flagged for
correction once run live.

## Do not enable without confirming first

Provider / Country Provider / Payment Mode create forms all have a **"Sync
with Nellys Coin"** toggle (defaults OFF). Nellys Coin is an unconfirmed
related Ejara system - don't flip this ON in any test, fixture, or manual
run until Rose confirms what it mirrors and whether it's reversible.

## CI

Not wired up yet. Once the suite is stable against testbox, add a GitHub
Actions workflow running `npm test` on push/PR (ask if you want this scaffolded
now vs. once there's real coverage).

## Test plan from the Ejara Automation Tool

The test plan is kept in the Ejara Automation Tool; this repo follows it.

- Each test starts with its ID (`PP-AUTH-01 …`): the tool's cases keep it as their former ID, so results from the
  tool's runner link to the cases. `npm run plan:apply -- <bundle.json>` (dry run; `--write` to apply) renames them to
  the tool's TC IDs and writes `test-plan/` (generated, never edited by hand).
- Runner results: when the tool's runner sets `EJARA_RESULTS_FILE`, `src/reporting/ejara-results.ts` writes one line
  per test (final attempt).
- `npm run test:unit` — unit tests (no browser). `npm run typecheck`. `ejara-automation.json` — what the tool reads.
  `CLAUDE.md` — conventions for AI changes.

## Catalog and automation steps (Ejara Automation Tool)
`npm run catalog` writes `catalog.json`: the page objects, their elements and actions, generated from the code. The
tool reads it on its daily repo check, so test cases written in the tool can use them (spec §6.10). Cases written with
automation steps run here without new code: in a run started from the tool, the runner downloads the run's plan and
`tests/tool/run-plan.spec.ts` creates one test per Runnable case, run step by step by `src/executor` with the page
objects' own locators. Values: `{{account.ADMIN.username}}` (password and otp never printed), `{{data.NAME}}` from
`PP_DATA_<NAME>` in `.env`, `{{run.env}}`. Payments run only with `PP_ALLOW_PAYMENTS=true`, new providers / policies /
payment modes only with `PP_ALLOW_SETTINGS_CHANGES=true` (testbox only); the whole case is skipped otherwise.
