class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.salutation         = page.locator('#personalSalutation, select[name="salutation"]').first();
    this.firstName          = page.locator('#billingAddress-personalFirstName');
    this.lastName           = page.locator('#billingAddress-personalLastName');
    this.email              = page.locator('#personalMail');
    this.street             = page.locator('#billingAddress-AddressStreet');
    this.zipcode            = page.locator('#billingAddressAddressZipcode');
    this.city               = page.locator('input[name="billingAddress[city]"]');
    this.country            = page.locator('select[name="billingAddress[countryId]"]');
    this.termsCheckbox      = page.locator('#tos, input[name="tos"]').first();
    this.confirmOrderButton = page.locator('#confirmFormSubmit, button[form="confirmOrderForm"]');
    this.registerSubmit     = page.locator('button:has-text("Continue")');
  }

  async continueAsGuest() {
    // Store goes straight to form, nothing to click
  }

  async fillAddress({ salutation, firstName, lastName, email, street, zipcode, city, country }) {
    if (await this.salutation.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.salutation.selectOption({ label: salutation });
    }
    await this.firstName.waitFor({ state: 'visible', timeout: 15000 });
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.email.waitFor({ state: 'visible', timeout: 10000 });
    await this.email.fill(email);
    await this.street.fill(street);
    await this.zipcode.fill(zipcode);
    await this.city.fill(city);
    if (await this.country.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.country.selectOption({ label: country });
    }

    // Select state if visible
    const stateSelect = this.page.locator('#billingAddressAddressCountryState');
    if (await stateSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await stateSelect.selectOption({ label: 'Berlin' });
    }
  }

  async submitAddressForm() {
    await this.registerSubmit.waitFor({ state: 'visible', timeout: 10000 });
    await this.registerSubmit.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCashOnDelivery() {
    const radios = this.page.locator('input[type="radio"]');
    const count = await radios.count();
    for (let i = 0; i < count; i++) {
      const radio = radios.nth(i);
      const id = await radio.getAttribute('id');
      const label = id
        ? await this.page.locator(`label[for="${id}"]`).textContent().catch(() => '')
        : '';
      if (label.toLowerCase().includes('cash')) {
        await radio.check();
        return;
      }
    }
    await radios.first().check();
  }

  async acceptTerms() {
    await this.termsCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    await this.termsCheckbox.check({ force: true });
  }

  async confirmOrder() {
    await this.confirmOrderButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.confirmOrderButton.scrollIntoViewIfNeeded();
    await this.confirmOrderButton.click({ force: true });
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { CheckoutPage };