import test, { expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

test("show password functionality", async ({ page }) => {
    const loginPage = await LoginPage.new(page);
    await loginPage.showPasswordField();

    const registerPage = await RegisterPage.new(page);
    await registerPage.showPasswordField();
});