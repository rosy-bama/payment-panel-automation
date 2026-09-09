# Payment Panel — Inferred Spec & Test Plan

No written specification exists for this application; it was built from meeting
discussions. This document is the reconstructed source of truth: every rule is
tagged **Confirmed** (verified with Rose/product/dev, or directly visible in a
screenshot) or **Inferred** (assumption/guess, not yet verified). Test scripts in
`tests/` reference this doc by module; anything still Inferred also carries a
`// INFERRED` comment at the point it's asserted in code.

Status legend: ✅ Confirmed · ❓ Inferred — needs confirmation · 🚧 Not yet explored

---

## How this gets filled in

1. Rose shares a screenshot, screen recording, or DOM snippet of a module.
2. Claude adds/updates the module section below and the matching page
   object/tests — marked ❓ Inferred by default.
3. Rose confirms/corrects business rules (via chat) or from whatever spec
   fragments she finds; confirmed lines flip to ✅.
4. Test scripts get filled in / un-skipped to match.

**Important limitation**: nothing in this project has been run against the
live app. This sandbox has no network access to `testbox-payment-panel.ejara.tech`
(confirmed via the proxy — 403 at the gateway, not a timeout). Everything here
comes from screenshots Rose has shared. Selectors are written to be as robust
as screenshots allow (role/label/placeholder text) but are unverified against
the real DOM until someone runs the suite.

---

## Environments

| Env | URL | Notes |
|---|---|---|
| Testbox | https://testbox-payment-panel.ejara.tech/ | Also deployed at ejara-pay.vercel.app (per Open Graph meta tags) ❓ unconfirmed if that's a separate environment |
| Production | *(not yet provided)* | OTP/authenticator code must reject an incorrect value ✅ (stated by Rose) |

## Tech stack (confirmed from page source + screenshots, 2026-09-09)

- ✅ React SPA served by Vite (`/assets/*.js` bundles) — no server-rendered
  content; selectors must come from screenshots/DevTools, not "view source."
- ✅ Uses Ant Design (`antd-*.js`) and Chakra UI (`chakra-*.js`) — favor
  role/placeholder/label locators over CSS classes.
- ✅ Public marketing/login copy: "Ejara Payment Service — Manage everything
  in one place," tagline "Built for the world," testimonial from Nelly
  Chatue Diop. Footer badges: Multi-Country, Lightning Fast, Bank-Grade
  Security.
- ✅ Authenticated shell: left sidebar + top bar with global search,
  notifications, and a per-user avatar (initials).
- ❓ Related system "Nellys Coin" — appears as a "Sync with Nellys Coin"
  toggle on Provider / Country Provider / Payment Mode create forms.
  Purpose and side effects unconfirmed — **do not enable this toggle in any
  automated test** until Rose confirms it's safe.
- ✅ Bilingual UI (English/Français) — language switcher top-right on the
  sign-in screen; Payment Mode's create form requires both EN and FR
  title/description, confirming bilingual data entry is a first-class
  concern app-wide, not just a UI nicety.

---

## Module: Authentication

**Confirmed (screenshots, 2026-09-09):**
- ✅ Sign-in screen: "Username"/"Password" fields (Ant Design Form.Item,
  red required asterisk), placeholder "Enter your username," a password
  show/hide toggle, and a "Sign in" button.
- ✅ OTP step **always** follows password entry (not conditional) and is a
  **TOTP authenticator-app code**, not SMS/email — screen heading is "Check
  your Authenticator App," subtext "Enter the 6-digit code below to
  complete your sign in."
- ✅ OTP is entered via **6 separate single-digit boxes**, visually grouped
  3-and-3 with a dash between groups (like `123 - 456`) — not one text field.
- ✅ OTP screen has a "Go back" link and a "Verify and sign in" button.
- ✅ Language switcher (top-right, all screens) offers English and Français.
- ✅ Testbox: any 6-digit code is accepted (test-environment-only relaxation).
- ✅ Production: an incorrect authenticator code must be rejected.
- ✅ Successful login lands on the Dashboard, which greets the user by first
  name: "Welcome back, **Rose**" — used as the automated post-login marker.

**Inferred — needs confirmation:**
- ❓ Password field's placeholder text (masked/unreadable in the screenshot).
- ❓ Error message copy on invalid password, and whether it's shown before
  or after the (would-be) OTP step.
- ❓ Whether repeated failed logins trigger a lockout, delay, or rate limit.
- ❓ Real production authenticator enrollment/reset flow (not shown — only
  the "enter code" step has been seen).
- ❓ Session length / idle timeout behavior.
- ❓ Whether the language switcher's choice persists across the OTP step,
  post-login pages, and future sessions.
- ❓ Exact DOM structure of the 6 OTP boxes (`src/utils/otp.ts` guesses
  `input[inputmode="numeric"]`-style attributes).

**Draft test cases** (see `tests/auth/login.spec.ts`, `tests/auth.setup.ts`):

| ID | Case | Priority | Status |
|---|---|---|---|
| AUTH-01 | Valid credentials + testbox OTP logs in successfully (reaches Dashboard, "Welcome back" visible) | High | Implemented |
| AUTH-02 | Invalid password shows an error, stays on login, OTP screen never appears | High | Implemented |
| AUTH-03 | Production: incorrect authenticator code is rejected | High | Skipped — needs prod/staging target |
| AUTH-04 | Repeated failed logins → lockout/rate-limit | Medium | Skipped — rule unconfirmed |
| AUTH-05 | Session expiry / idle timeout redirects to login | Medium | 🚧 Not started |
| AUTH-06 | Logout clears session (back button doesn't restore access) | Medium | 🚧 Not started |
| AUTH-07 | Language switcher changes UI language to Français and persists | Low | Skipped — persistence unconfirmed |
| AUTH-08 | OTP "Go back" returns to username/password step | Low | Skipped — exact behavior unconfirmed |

---

## Module: Navigation & Layout

**Confirmed (Dashboard screenshot, 2026-09-09):**
- ✅ Left sidebar groups: **Overview** (Dashboard, Transactions), a
  collapsible **"Ejara Pay Admin"** group (collapsed by default — contents
  not directly seen, but the Dashboard's "Accounts" card implies it holds at
  least an Accounts view), and **Settings** (Policies, Providers, Country
  Providers, Payment Mode).
- ✅ Top bar: sidebar collapse toggle, "Welcome back, `<first name>`", global
  search ("Search panel... ⌘K"), notification bell, user avatar (initials —
  "RB" for Rose's testbox account).

**Inferred — needs confirmation:**
- ❓ What's inside the expanded "Ejara Pay Admin" group (Accounts is a
  Dashboard card, not confirmed reachable from the sidebar itself).
- ❓ Global search (⌘K) scope — searches transactions? users? everything?
- ❓ Notification bell contents/behavior.

---

## Module: Dashboard

**Confirmed:**
- ✅ Banner: "This dashboard is still being built [In development]" — "Live
  metrics are not wired up yet. The sections listed below already work..."
  with a "COMING NEXT" list (volume/success-rate/revenue KPIs, daily
  volume/payment-mode charts, provider/country-provider health, failed
  transaction alerts and payout approvals) — i.e. Rose/the team already know
  this page is incomplete; don't test against KPI charts that don't exist yet.
- ✅ "Available sections" card grid: Transactions (Overview), Accounts
  (Ejara Pay Admin), Transactions (Ejara Pay Admin) [sic, two
  differently-scoped "Transactions" cards], Policies / Providers / Country
  Providers / Payment Mode (Settings).

**Draft test cases:** see `tests/smoke/navigation.spec.ts`.

---

## Module: Transactions

**Confirmed (screenshot, 2026-09-09):**
- ✅ Subtitle: "All-time global transactions across every region and currency."
- ✅ Controls: date grouping ("Daily"), quick ranges (7d/30d/60d/90d),
  calendar picker, "+ Make Payment" (opens the wizard — see below), refresh icon.
- ✅ Five "All time" stat cards: Total Volume, Transactions (count), Success
  Rate, Avg Completion Time, Unique Customers.
- ✅ Status filter pills with live counts: All / Initiated / Confirmed /
  Rejected / Awaiting Approval.
- ✅ Search by keyword, Filter button, export/download icon.
- ✅ Table columns: Id, Created At, Username (+ phone + country flag),
  Status, Transaction Type (Pay in/Pay out), Paid Amount, Raw Amount, Global
  Fees, Provider, Payment Mode, Feature, Internal Ref. Paginated (page-size
  selector, numbered pages).

**Inferred:** status tab → table filtering behavior, date range → stat card
recalculation, search matching scope, export format/scope — all unconfirmed.

**Draft test cases:** see `tests/transactions/transactions.spec.ts`.

---

## Module: Make Payment (wizard)

The core money-movement flow — highest risk in the app. Opened via
Transactions → "+ Make Payment."

**Confirmed (screenshots, 2026-09-09), 3 steps + step-up OTP + result:**

*Step 1 — User:*
- ✅ "Payment Direction" toggle: **Pay In** / **Pay Out** (icon buttons).
- ✅ Username\* (search-style input), Email Address\* (email input).
- ✅ "Reset" and "Continue" actions; Continue appears disabled until
  direction + both fields are filled (❓ exact trigger unconfirmed).

*Step 2 — Payment:* (shown for Pay In; Pay Out not yet demoed)
- ✅ Header badge confirms direction + recipient email.
- ✅ "Payment Details": Country\*, Currency\*, Amount\*, Feature\* (e.g. "For
  CNPS contributions").
- ✅ "Payment Method": Payment Type\* (e.g. Mobile Money), Payment Mode\*
  (e.g. MTN Mobile Money), Phone Number\*, External Transaction Reference\*,
  Comment\* (max 100 characters), checkbox "This is a payment voucher."
- ✅ Live preview box showing formatted amount + feature.
- ✅ "Review" button appears disabled until External Reference + Comment are
  filled (❓ exact trigger unconfirmed — Amount/phone were already filled
  when this was observed).

*Step 3 — Review:*
- ✅ Warning banner, **verbatim**: "Double-check the reference and amount —
  payment records cannot be reversed."
- ✅ Full summary of every entered field (Direction, Amount, User, Payment
  Mode + phone, Country & Currency, Feature, External Reference, Comment).
- ✅ "Make Payment" button (enabled) submits.

*Step-up OTP challenge:*
- ✅ A **second** OTP challenge appears before the payment is actually
  processed: heading "Confirm it's you," subtext "Enter the 6-digit code
  from your Authenticator App to continue," same 6-box input as login, "Go
  back" link, button labeled **"Verify"** (not "Verify and sign in").

*Result:*
- ✅ "Verified" checkmark + "Processing your request..." with a progress bar.
  (Final resting state — success page/toast/redirect — not yet seen.)

**Inferred — needs confirmation (all high-value to nail down given this
moves real money):**
- ❓ Full validation rules per field (formats, required-ness by direction).
- ❓ Whether Pay Out needs different/extra fields than Pay In.
- ❓ Effect of "This is a payment voucher" checkbox.
- ❓ Whether amount is checked against the relevant Country Provider config's
  Min/Max Amount (see Country Providers module) at this step.
- ❓ What happens on an incorrect step-up OTP code (reject + stay on Review?
  reject + start over?).
- ❓ Final success state after "Processing your request..." — toast? new
  transaction row visible immediately? redirect back to Transactions?
- ❓ Whether "External Transaction Reference" must be unique.

**Draft test cases:** see `tests/payments/make-payment.spec.ts` — all
currently skipped (blocked on Ant Design select interaction details and live
confirmation of the above), but written out in full so a first live run is
mostly a matter of un-skipping and fixing selectors rather than designing
cases from scratch.

---

## Module: Policies

Payout approval / abuse controls — compliance/fraud-relevant, high business
risk if misconfigured or if automation asserts the wrong thing here.

**Confirmed (screenshot, 2026-09-09):**
- ✅ Three sub-tabs: Payout Approval Policy / Payout Abuse Policy / Payin
  Abuse Policy.
- ✅ "Filter by feature" dropdown, "+ New Policy," table: Id, Created At,
  From, To, Required Approvals, Feature, Status (Active/Inactive), Created
  By, Updated By, Updated At.
- ✅ Example rows: ALL feature 500,000–2,000,000 → 10 approvals (Active);
  FIAT 1,000–500,000 → 1 approval (Active); LITE 100,000–250,000 → 2
  approvals (**Inactive**).
- ✅ "New Payout Approval Policy" drawer: From\*, To\* (numeric with
  spinners), Required Approvals\* (numeric), Feature\* (dropdown).
- ✅ Table's "Created By" shows other test accounts besides Rose's:
  `recitPatricia`, `recitRaymondTest` — useful context if audit-trail tests
  are ever written, but no credentials for these are held here.

**Inferred:** whether From/To ranges can overlap; whether an Inactive policy
is truly ignored at payout time; Payout Abuse / Payin Abuse tab field shapes
(not yet seen — only Payout Approval's create drawer was shown).

**Draft test cases:** see `tests/settings/policies.spec.ts`.

---

## Module: Providers

**Confirmed (screenshot, 2026-09-09):**
- ✅ Filter pills All/Active/Inactive with counts, search by name, "+ New
  Provider," table: Id, Provider Name, Status, Description, Created By,
  Updated By, Date Created, Date Updated.
- ✅ 20 providers seen, all Active: GIMACPAY, AFRIBAPAY, PEEX, EASYTRANSAC,
  KKIAPAY, STRIPE, PAYPAL, DIRECT_OM, MAVIANCE, and a placeholder "NEW PROVIDER."
- ✅ "New Provider" drawer: Name\*, Description\*, "Active" toggle (**ON by
  default** — "Provider is available for transactions right away"), "Sync
  with Nellys Coin" toggle (OFF by default).

**Draft test cases:** see `tests/settings/providers.spec.ts`.

---

## Module: Country Providers

The richest/highest-risk config screen — per-country, per-provider payment
rules (fees, min/max amounts, OTP/browser requirements).

**Confirmed (screenshot, 2026-09-09):**
- ✅ Stat cards: Total Configs (175, "All environments"), Live Configs (117,
  "58 in test"), Countries (17, "Distinct countries"), Providers (10,
  "Distinct providers").
- ✅ Filter pills All/Pay in/Pay out; Country and Provider filter dropdowns;
  a green **"Switch Live"** button (❓ purpose inferred, not confirmed —
  possibly toggles the table's Live/Test view, possibly something riskier
  like bulk-promoting configs).
- ✅ Table columns: Id, Country/Provider (flag + name), Payment Mode,
  Transaction Type (Pay in/out), Customer Type (client/collector),
  Environment (Live/Test badge), Fees, Ejara Fees, Min Amount, Max Amount,
  Feature, Gateway, Automatic (Yes/No), Require OTP (Yes/No), Date Created.
- ✅ "New Country Provider" drawer fields: Country\*, Payment Provider\*,
  Payment Mode\*, Transaction Type\*, Feature (optional), Customer Type
  (optional), Payment Gateway\* (free text, e.g. `account_to_wallet` /
  `account_transfer`), Fees Policy\* + Fees Value\* (e.g. `0.06`), Ejara Fees
  Policy\* + Ejara Fees Value\* (e.g. `0.03`), Min/Max Amount (optional),
  OTP Code USSD (optional), Payment USSD (optional), toggles: **"Require
  OTP"** ("Customer must enter an OTP to complete payment"), **"Require
  Browser"** ("Payment flow needs a browser (3-DS/redirect)"), "Sync with
  Nellys Coin."

**Inferred:** "Switch Live" exact behavior; whether Min/Max Amount here is
enforced during Make Payment (see that module); Fees Value format (decimal
fraction assumed from placeholders + table showing %, e.g. 0.06 → 6%, but
unconfirmed); USSD fields' role (relevant for feature-phone/USSD-based
mobile money flows common in the region, per Rose's fintech context).

**Draft test cases:** see `tests/settings/country-providers.spec.ts`.

---

## Module: Payment Mode

**Confirmed (screenshot, 2026-09-09):**
- ✅ Filter pills All/Active/Inactive, "Filter by payment type," search by
  code or description, "+ New Payment Mode," table: Id, Code, Description,
  Payment Type, Funding Source (Bank/Mobile Money badge), Status, Created
  By, Updated By, Date Created, Date Updated.
- ✅ Example rows: GIMACPAY-provider bank codes (BICEC, SG Cameroon,
  Afriland First Bank, CITIBANK Cameroon, CBC, UBC, Ecobank Cameroon,
  M2U(UBA), BGFI Cameroon, CCA BANK).
- ✅ "New Payment Mode" drawer: Code\*, **Title (EN)\* and Title (FR)\* side
  by side** (both required), Funding Source\* (dropdown), Payment Type\*
  (dropdown), Description (EN) and Description (FR) (optional textareas),
  "Sync with Nellys Coin" toggle.

**Draft test cases:** see `tests/settings/payment-mode.spec.ts`.

---

## Cross-cutting notes

- **"Sync with Nellys Coin"** appears on Provider, Country Provider, and
  Payment Mode create forms, always defaulting OFF. Nellys Coin is presumably
  a related/sister Ejara product. **Do not enable this toggle in any
  automated test** until Rose confirms what it mirrors and whether it's
  reversible.
- **Bilingual (EN/FR) fields** are required in at least Payment Mode's
  create form — worth a dedicated test that submitting with only one
  language filled is rejected, once drawer behavior is confirmed live.
- **OTP appears twice** in the app: once at login (TOTP authenticator,
  always shown) and again as a step-up challenge before Make Payment
  submits. Both use the same 6-box UI (`src/utils/otp.ts` is shared between
  `LoginPage` and `MakePaymentWizard`) but different button text ("Verify
  and sign in" vs "Verify").
- **Ant Design comboboxes**: several fields documented as "dropdowns" above
  (Country, Feature, Payment Type, Payment Mode, Fees Policy, etc.) are
  almost certainly Ant Design `Select` components, which usually need a
  click-to-open + click-an-option interaction rather than `.fill()` or
  native `.selectOption()`. `MakePaymentWizard.fillPaymentStep()` currently
  uses `.fill()` as a placeholder specifically flagged for correction.

---

## Open questions for Rose

- [ ] Full menu structure confirmation — is there anything beyond Dashboard
      / Transactions / Policies / Providers / Country Providers / Payment
      Mode / (collapsed) Ejara Pay Admin → Accounts?
- [ ] What does "Switch Live" do on Country Providers?
- [ ] What does "Sync with Nellys Coin" actually mirror, and is it safe to
      exercise in a test?
- [ ] Any existing artifacts: Figma files, ClickUp tickets, old test cases,
      support tickets describing bugs/expected behavior for any of the
      modules above.
- [ ] Access to a production or non-prod-but-real-authenticator environment,
      for AUTH-03 and the Make Payment step-up OTP equivalent.
- [ ] Confirm it's safe to run PAY-01 (a real Make Payment submission)
      against testbox unattended/in CI, or whether it should stay
      manually-triggered only.
- [ ] Whether this suite should eventually live alongside your FX Web
      Portal / CNPS Pay ClickUp test case structure, or stay purely as
      automated Playwright specs.
