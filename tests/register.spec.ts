import test, { expect } from "@playwright/test";
import RegisterPage from "../pages/RegisterPage";
import ProductPages from "../pages/ProductsPage";

test("After registration the authenticated version of the main page is displayed", async ({ page }) => {
    const email = `john.doe.${Date.now()}@example.com`;

    const registerPage = await RegisterPage.new(page);
    await registerPage.register({
        email,
        password: "password123",
        firstName: "John",
        lastName: "Doe"
    });

    const productPage = await ProductPages.new(page);
    await expect(productPage.header.profileButton).toBeVisible();
});
