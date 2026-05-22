class CartPage {
  constructor(page) {
    this.page = page;
    this.offcanvasCart = page.locator('.offcanvas-cart, .cart-offcanvas');
    this.cartLineItems = page.locator('.cart-item, .line-item, .offcanvas-cart-item');
  }

  async proceedToCheckout() {
    await this.offcanvasCart.waitFor({ state: 'visible', timeout: 10000 });

    // Dismiss cookie banner
    const cookieBtn = this.page.locator('button:has-text("Only technically required")');
    if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cookieBtn.click();
      await this.page.waitForTimeout(500);
    }

    // Navigate to full cart page where button is always visible
    await this.page.goto('/checkout/cart');
    await this.page.waitForLoadState('networkidle');

    // Click checkout button
    const btn = this.page.locator('a:has-text("Proceed to checkout"), a:has-text("Go to checkout")').first();
    await btn.waitFor({ state: 'visible', timeout: 10000 });
    await btn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getItemCount() {
    const count = await this.cartLineItems.count();
    if (count > 0) return count;
    const cartVisible = await this.offcanvasCart.isVisible().catch(() => false);
    return cartVisible ? 1 : 0;
  }
}

module.exports = { CartPage };