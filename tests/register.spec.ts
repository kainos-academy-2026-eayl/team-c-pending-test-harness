import test, { expect } from "@playwright/test";
import RegisterPage from "../pages/RegisterPage";
import ProductPage from "../pages/ProductPage";

test("After registration the authenticated version of the main page is displayed", async ({ page }) => {
    const registerPage = await RegisterPage.new(page);
    await registerPage.register({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123"
    });

    const productPage = await ProductPage.new(page);
    expect(productPage.profileButton).toBeVisible();
});
