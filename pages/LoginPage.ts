import { Locator, Page } from "@playwright/test";
import { text } from "stream/iter";
import { expect } from "@playwright/test";

export default class LoginPage {
    private emailField: Locator;
    private passwordField: Locator;
    private loginButton: Locator;
    private showPassword: Locator;

    static async new(page: Page) {
        await page.goto("/login");
        return new LoginPage(page);
    }

    private constructor(private page: Page) {
        this.emailField = page.getByTestId("email");
        this.passwordField = page.getByTestId("password");
        this.loginButton = page.getByTestId("login-button");
        this.showPassword = page.getByTestId("show-password");
    }
    public async showPasswordField() {
        await this.showPassword.click();
        await expect(this.passwordField).toHaveAttribute("type", "text");
    }
    public async login(opts: { email: string, password: string; }) {
        await this.emailField.fill(opts.email);
        await this.passwordField.fill(opts.password);
        await this.loginButton.click();
    }
}
