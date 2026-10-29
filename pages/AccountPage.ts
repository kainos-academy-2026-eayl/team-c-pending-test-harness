import { Locator, Page } from "@playwright/test";

export default class AccountPage {
    static async new(page: Page) {
        await page.goto("/account");
        return new AccountPage(page);
    }

    private logoutButton: Locator;

    private constructor(private page: Page) {
        this.logoutButton = page.getByTestId("logout-button");
    }

    async logout() {
        await this.logoutButton.click();
    }
}
