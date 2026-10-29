import test, { expect } from "@playwright/test";
import RegisterPage from "../pages/RegisterPage";
import ProductPage from "../pages/ProductPage";
import BasketPage from "../pages/basketPage";

test("Add item to basket", async ({ page }) => {
    const email = `john.doe.${Date.now()}@example.com`;
    const registerPage = await RegisterPage.new(page);
    await registerPage.register({
        email,
        password: "password123",
        firstName: "John",
        lastName: "Doe"
    });

    const productPage = await ProductPage.new(page);

    const name = await productPage.products[0].name();
    await productPage.products[0].addToBasket();

    const basketPage = await BasketPage.new(page);

    expect(await basketPage.products[0].name()).toBe(name);
});

test("Basket quantity controls work", async ({ page }) => {
    const email = `john.doe.${Date.now()}@example.com`;
    const registerPage = await RegisterPage.new(page);
    await registerPage.register({
        email,
        password: "password123",
        firstName: "John",
        lastName: "Doe"
    });

    const productPage = await ProductPage.new(page);

    const name = await productPage.products[0].name();
    await productPage.products[0].addToBasket();

    const basketPage = await BasketPage.new(page);

    expect(await basketPage.products[0].name()).toBe(name);

    await basketPage.products[0].increaseQuantity();
    expect(await basketPage.products[0].quantity()).toBe(2);

    await basketPage.products[0].decreaseQuantity();
    expect(await basketPage.products[0].quantity()).toBe(1);
});
