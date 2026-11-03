import test, { expect, Page } from "@playwright/test";
import AccountPage from "../pages/AccountPage";
import AdminPortalPage from "../pages/AdminPortalPage";
import BasketPage from "../pages/BasketPage";
import LoginPage from "../pages/LoginPage";
import ProductsPage from "../pages/ProductsPage";
import RegisterPage from "../pages/RegisterPage";

function skipWithoutAdminCredentials() {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        test.skip(true, "Set ADMIN_EMAIL and ADMIN_PASSWORD to run admin portal tests");
    }
}

async function loginAsAdmin(page: Page) {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error("Admin credentials are required for this test");
    }

    const loginPage = await LoginPage.new(page);
    await loginPage.login({ email, password });
    await expect(page.getByRole("link", { name: "Admin portal" })).toBeVisible();
}

test("regular customers cannot access the admin portal", async ({ page }) => {
    const email = `john.doe.${Date.now()}@example.com`;
    const registerPage = await RegisterPage.new(page);
    await registerPage.register({
        email,
        password: "password123",
        firstName: "John",
        lastName: "Doe"
    });

    await expect(page.getByRole("link", { name: "Admin portal" })).not.toBeVisible();
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("link", { name: "Admin portal" })).not.toBeVisible();
});

test("admins can edit and delete a customer", async ({ page }) => {
    skipWithoutAdminCredentials();

    const email = `john.doe.${Date.now()}@example.com`;
    const updatedEmail = `john.updated.${Date.now()}@example.com`;
    const registerPage = await RegisterPage.new(page);
    await registerPage.register({
        email,
        password: "password123",
        firstName: "John",
        lastName: "Doe"
    });

    const accountPage = await AccountPage.new(page);
    await accountPage.logout();
    await loginAsAdmin(page);

    const adminPage = await AdminPortalPage.new(page);
    await adminPage.searchCustomers(email);
    await adminPage.updateFirstCustomer({
        firstName: "Updated",
        lastName: "Customer",
        email: updatedEmail
    });
    await expect(adminPage.successMessage("Customer details updated")).toBeVisible();

    await adminPage.searchCustomers(updatedEmail);
    await expect(page.getByLabel("First name")).toHaveValue("Updated");
    await expect(page.getByLabel("Last name")).toHaveValue("Customer");
    await adminPage.deleteFirstCustomer();
    await expect(page.getByText("No customers found.", { exact: false })).toBeVisible();
});

test("hiding a product removes it from a customer's basket", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Avoid concurrent changes to the shared product catalog");
    skipWithoutAdminCredentials();

    const email = `john.doe.${Date.now()}@example.com`;
    const password = "password123";
    const registerPage = await RegisterPage.new(page);
    await registerPage.register({
        email,
        password,
        firstName: "John",
        lastName: "Doe"
    });

    const productsPage = await ProductsPage.new(page);
    const product = productsPage.products[1];
    if (!product) {
        throw new Error("The product visibility test requires at least two visible products");
    }
    const productName = (await product.name())?.trim();
    if (!productName) {
        throw new Error("The selected product has no name");
    }
    await product.addToBasket();

    const customerAccount = await AccountPage.new(page);
    await customerAccount.logout();

    await loginAsAdmin(page);
    const adminPage = await AdminPortalPage.new(page);
    await adminPage.openProducts();
    await adminPage.searchProducts(productName);

    const updatedName = `${productName} E2E ${Date.now()}`;
    let productMayHaveChanged = false;
    try {
        productMayHaveChanged = true;
        await adminPage.updateFirstProductName(updatedName);
        await expect(adminPage.successMessage("Product details updated")).toBeVisible();

        await adminPage.searchProducts(updatedName);
        expect(await adminPage.firstProductName()).toBe(updatedName);
        await adminPage.hideFirstProduct();
        await expect(adminPage.successMessage("Product hidden")).toBeVisible();

        const adminAccount = await AccountPage.new(page);
        await adminAccount.logout();
        const customerLogin = await LoginPage.new(page);
        await customerLogin.login({ email, password });

        const basketPage = await BasketPage.new(page);
        expect(await basketPage.hasProduct(productName)).toBe(false);
    } finally {
        if (productMayHaveChanged) {
            await loginAsAdmin(page);
            const cleanupPage = await AdminPortalPage.new(page);
            await cleanupPage.openProducts();
            await cleanupPage.searchProducts(updatedName);
            if (await cleanupPage.productCount() === 0) {
                await cleanupPage.searchProducts(productName);
            }
            await cleanupPage.showFirstProductIfHidden();
            if (await cleanupPage.firstProductName() !== productName) {
                await cleanupPage.updateFirstProductName(productName);
            }
        }
    }
});
