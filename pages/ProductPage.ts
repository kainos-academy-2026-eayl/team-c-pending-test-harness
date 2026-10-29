import { Locator, Page } from "@playwright/test";

export default class ProductPage {

    profileButton: Locator;

    static async new(page: Page) {
        await page.goto("/");
        return new ProductPage(page);
    }

    private constructor(private page: Page) {
        this.profileButton = page.getByTestId("profile-button");
    }
}
