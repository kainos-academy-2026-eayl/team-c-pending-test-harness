import { Locator, Page } from "@playwright/test";
import HeaderPage from "./Header";

export default class ProductsPage {

    header: HeaderPage;

    static async new(page: Page) {
        await page.goto("/");

        return new ProductsPage(page, (await page.getByTestId("product").all()).map(product => new Product(product)));
    }

    private constructor(private page: Page, public products: Product[]) {
        this.header = new HeaderPage(page);
    }
}

class Product {
    private nameLabel: Locator;
    private addToBasketButton: Locator;

    constructor(private section: Locator) {
        this.nameLabel = section.getByTestId("product-name");
        this.addToBasketButton = section.getByTestId("add-to-basket-button");
    }

    async addToBasket() {
        await this.addToBasketButton.click();
    }

    async name() {
        return await this.nameLabel.textContent();
    }

    async goToProductPage() {
        await this.nameLabel.click();
    }
}
