class ProductDetailPage {
  constructor(page) {
    this.page = page;
    this.addToCartButton = page.locator('button.btn-buy, button:has-text("Add to cart"), button:has-text("Add to shopping cart")').first();
    this.productName = page.locator('h1, .product-detail-name').first();
    this.offcanvasCart = page.locator('.offcanvas-cart, .cart-offcanvas');
  }

  async addToCart() {
    // Dismiss cookie banner if still showing
    const cookieBtn = this.page.locator('button:has-text("Only technically required")');
    if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cookieBtn.click();
      await this.page.waitForTimeout(500);
    }
    await this.addToCartButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.addToCartButton.click();
    try {
      await this.offcanvasCart.waitFor({ state: 'visible', timeout: 10000 });
    } catch {
      await this.page.waitForTimeout(3000);
    }
  }

  async getProductName() {
    await this.productName.waitFor({ state: 'visible', timeout: 15000 });
    return (await this.productName.textContent()).trim();
  }
}

module.exports = { ProductDetailPage };