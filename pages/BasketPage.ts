import { Locator, Page } from "@playwright/test";

export default class BasketPage {

    static async new(page: Page) {
        await page.goto("/basket");

        return new BasketPage(page, (await page.getByTestId("product").all()).map(product => new Product(product)));
    }


    private constructor(private page: Page, public products: Product[]) { }

}

class Product {

    private nameLabel: Locator;

    constructor(private section: Locator) {
        this.nameLabel = section.getByTestId("product-name");
    }

    async name() {
        return this.nameLabel.textContent();
    }

    async quantity() {
        return parseInt(await this.section.getByTestId("quantity").textContent() || "0", 10);
    }

    async increaseQuantity() {
        await this.section.getByTestId("increase-quantity").click();
    }

    async decreaseQuantity() {
        await this.section.getByTestId("decrease-quantity").click();
    }
}
