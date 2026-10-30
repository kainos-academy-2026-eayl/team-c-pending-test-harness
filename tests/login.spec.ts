import test, { expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import ProductPage from "../pages/ProductPage";
import RegisterPage from "../pages/RegisterPage";

test("After login the authenticated version of the main page is displayed", async ({ page }) => {
    const email = `john.doe.${Date.now()}@example.com`;

    const registerPage = await RegisterPage.new(page);
    await registerPage.register({
        email,
        password: "password123",
        firstName: "John",
        lastName: "Doe"
    });

    const loginPage = await LoginPage.new(page);
    await loginPage.login({
        email,
        password: "password123"
    });

    const productPage = await ProductPage.new(page);
    await expect(productPage.header.profileButton).toBeVisible();
});
