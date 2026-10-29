import test, { expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import AccountPage from "../pages/AccountPage";
import ProductPage from "../pages/ProductPage";

test("After logout the unauthenticated version of the main page is displayed", async ({ page }) => {
    const loginPage = await LoginPage.new(page);
    await loginPage.login({
        email: "john.doe@example.com",
        password: "password123"
    });

    const accountPage = await AccountPage.new(page);
    await accountPage.logout();

    const productPage = await ProductPage.new(page);
    await expect(productPage.profileButton).not.toBeVisible();
});
