import test, { expect } from "@playwright/test";
import RegisterPage from "../pages/RegisterPage";
import AccountPage from "../pages/AccountPage";
import ProductPage from "../pages/ProductPage";

test("After logout the unauthenticated version of the main page is displayed", async ({ page }) => {
    const email = `john.doe.${Date.now()}@example.com`;

    const registerPage = await RegisterPage.new(page);
    await registerPage.register({
        email,
        password: "password123",
        firstName: "John",
        lastName: "Doe"
    });

    const accountPage = await AccountPage.new(page);
    await accountPage.logout();

    const productPage = await ProductPage.new(page);
    await expect(productPage.header.profileButton).not.toBeVisible();
});
