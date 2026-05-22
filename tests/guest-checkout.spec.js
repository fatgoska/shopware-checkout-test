const { test, expect } = require('@playwright/test');
const { StorefrontPage }     = require('../pages/StorefrontPage');
const { ProductListingPage } = require('../pages/ProductListingPage');
const { ProductDetailPage }  = require('../pages/ProductDetailPage');
const { CartPage }           = require('../pages/CartPage');
const { CheckoutPage }       = require('../pages/CheckoutPage');

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test('TC-P01: Guest can browse a product and complete checkout with Cash on Delivery', async ({ page }) => {

  const storefront = new StorefrontPage(page);
  const listing    = new ProductListingPage(page);
  const detail     = new ProductDetailPage(page);
  const cart       = new CartPage(page);
  const checkout   = new CheckoutPage(page);

  // Step 1: Open Clothing category
  await storefront.goto();
  await storefront.dismissCookieBanner();
  await expect(page).toHaveURL(/Clothing/);

  // Step 2: Click first product
  await listing.clickFirstProduct();
  await expect(page).toHaveURL(/detail|Clothing/);

  // Step 3: Add to cart
  await detail.addToCart();
  const itemCount = await cart.getItemCount();
  expect(itemCount).toBeGreaterThan(0);

  // Step 4: Proceed to checkout
  await cart.proceedToCheckout();
  await expect(page).toHaveURL(/checkout/);

  // Step 5: Continue as guest
  await checkout.continueAsGuest();

  // Step 6: Fill address form
  await checkout.fillAddress({
    salutation: 'Mr.',
    firstName:  'John',
    lastName:   'Doe',
    email:      `guest.test.${Date.now()}@example.com`,
    street:     '123 Test Street',
    zipcode:    '10115',
    city:       'Berlin',
    country:    'Germany',
  });
  await checkout.submitAddressForm();

  // Step 7: Select Cash on Delivery
  await checkout.selectCashOnDelivery();

  // Step 8: Accept terms and confirm
  await checkout.acceptTerms();
  await checkout.confirmOrder();

  // Step 9: Assert order confirmation
  await expect(page).toHaveURL(/checkout\/finish/);
  await expect(page.locator('body')).toContainText(/Your order number/i);
});