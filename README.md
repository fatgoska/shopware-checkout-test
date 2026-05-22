# Shopware 6 — Guest Checkout Automated Test

**Solution25 QA Practical Exercise — Part 2**

## What This Tests

An end-to-end automated test of the full guest checkout flow on the Shopware 6 demo storefront:

1. Navigate to the Clothing category
2. Dismiss the cookie consent banner
3. Click the first available product
4. Add it to the cart
5. Proceed to checkout as a guest
6. Fill in customer and address details
7. Select "Cash on Delivery" as the payment method
8. Accept terms and confirm the order
9. Assert the order confirmation page loads at /checkout/finish

## Test Environment

- **Target:** https://shopware6-demo.development-s25.com
- **Browser:** Chromium (headless by default)
- **Framework:** Playwright (JavaScript)

## Setup

Requires Node.js v18+.

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install chromium
```

## Running the Test

```bash
# Run in headless mode
npx playwright test

# Run with browser visible (useful for debugging)
npx playwright test --headed

# Run with Playwright's interactive UI
npx playwright test --ui
```

## Project Structure

```
shopware-checkout-test/
├── pages/
│   ├── StorefrontPage.js       # Clothing category navigation + cookie banner
│   ├── ProductListingPage.js   # Product listing + first product click
│   ├── ProductDetailPage.js    # Product detail + add to cart
│   ├── CartPage.js             # Offcanvas cart + proceed to checkout
│   └── CheckoutPage.js         # Guest form, payment selection, confirm
├── tests/
│   └── guest-checkout.spec.js  # Main test (TC-P01)
├── playwright.config.js
├── package.json
└── README.md
```

## Design Decisions

- **Page Object Model** — each page has its own class to keep the test readable and maintainable
- **Stable selectors** — element IDs and semantic selectors are used instead of fragile CSS class chains
- **Cookie banner handling** — dismissed automatically at the start and before add to cart
- **Meaningful assertions** — URL patterns are asserted at each major step, not just "page loaded"
- **Unique email per run** — `Date.now()` is used in the guest email to avoid conflicts between runs

## What I Would Improve With More Time

- Write separate spec files for the negative and edge cases from the test plan
- Add assertion on the visible order number on the finish page
- Parameterise guest details so different address locales can be tested easily
- Set up a GitHub Actions CI workflow to run on every push