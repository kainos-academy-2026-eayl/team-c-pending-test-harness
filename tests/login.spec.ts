import test, { expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import ProductPage from "../pages/ProductPage";

test("After login the authenticated version of the main page is displayed", async ({ page }) => {
    const loginPage = await LoginPage.new(page);
    await loginPage.login({
        email: "john.doe@example.com",
        password: "password123"
    });

    const productPage = await ProductPage.new(page);
    expect(productPage.profileButton).toBeVisible();
});
