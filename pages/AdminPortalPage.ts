import { Locator, Page } from "@playwright/test";

export default class AdminPortalPage {
    static async new(page: Page) {
        await page.goto("/admin");
        return new AdminPortalPage(page);
    }

    private constructor(private page: Page) { }

    async openProducts() {
        await this.page.getByRole("link", { name: "Edit products" }).click();
    }

    async searchCustomers(query: string) {
        const search = this.page.getByRole("search");
        await search.getByLabel("Search customers by name or email").fill(query);
        await search.getByRole("button", { name: "Search customers" }).click();
    }

    async searchProducts(query: string) {
        const search = this.page.getByRole("search");
        await search.getByLabel("Search products by name").fill(query);
        await search.getByRole("button", { name: "Filter products" }).click();
    }

    async updateFirstCustomer(customer: { firstName: string, lastName: string, email: string }) {
        const customerForm = this.page.locator("fieldset").first();
        await customerForm.getByLabel("First name").fill(customer.firstName);
        await customerForm.getByLabel("Last name").fill(customer.lastName);
        await customerForm.getByLabel("Email").fill(customer.email);
        await customerForm.getByRole("button", { name: "Save customer" }).click();
    }

    async deleteFirstCustomer() {
        await this.page.getByRole("link", { name: "Delete customer" }).click();
        await this.page.getByRole("button", { name: "Confirm deletion" }).click();
    }

    async firstProductName() {
        return this.firstProduct().getByLabel("Name").inputValue();
    }

    async updateFirstProductName(name: string) {
        const product = this.firstProduct();
        await product.getByLabel("Name").fill(name);
        await product.getByRole("button", { name: "Save product" }).click();
    }

    async hideFirstProduct() {
        await this.firstProduct().getByRole("button", { name: "Delete product" }).click();
    }

    async showFirstProductIfHidden() {
        const showButton = this.firstProduct().getByRole("button", { name: "Add product" });
        if (await showButton.isVisible()) {
            await showButton.click();
        }
    }

    async productCount() {
        return this.page.locator("fieldset").count();
    }

    successMessage(message: string): Locator {
        return this.page.getByRole("status").filter({ hasText: message });
    }

    private firstProduct(): Locator {
        return this.page.locator("fieldset").first();
    }
}
