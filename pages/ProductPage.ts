import { Locator, Page } from "@playwright/test";
export default class ProductPage {

    static async from(page: Page) {
        const reviews = (await page.getByTestId("review").all()).map(review => new Review(review));

        return new ProductPage(page, reviews);
    }

    private constructor(private page: Page, public reviews: Review[]) {
    }

    async addReview(stars: 1 | 2 | 3 | 4 | 5, message: string) {
        await this.page.getByTestId("add-review-link-" + (stars - 1)).click();

        await this.page.getByTestId("next-button").click();

        await this.page.getByTestId("message").fill(message);

        await this.page.getByTestId("post-button").click();
    }
}

class Review {
    private reviewerNameLabel: Locator;
    private reviewTextLabel: Locator;
    constructor(private section: Locator) {
        this.reviewerNameLabel = section.getByTestId("review-author");
        this.reviewTextLabel = section.getByTestId("review-comment");
    }

    async getReviewerName() {
        return (await this.reviewerNameLabel.textContent())?.trim();
    }

    async getReviewText() {
        return await this.reviewTextLabel.textContent();
    }
}
