class ProductListingPage {
  constructor(page) {
    this.page = page;
    this.firstProduct = page.locator('.product-box').first();
  }

  async clickFirstProduct() {
    await this.firstProduct.waitFor({ state: 'visible', timeout: 15000 });
    await this.firstProduct.click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { ProductListingPage };