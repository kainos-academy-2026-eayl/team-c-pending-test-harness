import test, { expect } from "@playwright/test";
import RegisterPage from "../pages/RegisterPage";
import ProductsPage from "../pages/ProductsPage";
import ProductPage from "../pages/ProductPage";

test("add a review", async ({ page }) => {

    const email = `john.doe.${Date.now()}@example.com`;
    const registerPage = await RegisterPage.new(page);
    await registerPage.register({
        email,
        password: "password123",
        firstName: "John",
        lastName: "Doe"
    });

    const productsPage = await ProductsPage.new(page);

    await productsPage.products[0].goToProductPage();

    const productPage = await ProductPage.from(page);

    await productPage.addReview(4, email);

    const productsPageSecond = await ProductsPage.new(page);

    await productsPageSecond.products[0].goToProductPage();

    const productPageSecond = await ProductPage.from(page);

    expect(await Promise.all(productPageSecond.reviews.map(async review => await review.getReviewText()))).toContain(email);
});
