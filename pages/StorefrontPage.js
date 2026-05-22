class StorefrontPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/Clothing/');
    await this.page.waitForLoadState('networkidle');
  }

  async dismissCookieBanner() {
    const cookieBtn = this.page.locator('button:has-text("Only technically required")');
    if (await cookieBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cookieBtn.click();
    }
  }
}

module.exports = { StorefrontPage };