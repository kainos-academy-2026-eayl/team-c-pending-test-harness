import { Locator, Page } from "@playwright/test";

export default class RegisterPage {
    private firstNameField: Locator;
    private lastNameField: Locator;
    private emailField: Locator;
    private passwordField: Locator;
    private confirmPasswordField: Locator;
    private registerButton: Locator;

    static async new(page: Page) {
        await page.goto("/register");
        return new RegisterPage(page);
    }

    private constructor(private page: Page) {
        this.firstNameField = page.getByTestId("first-name");
        this.lastNameField = page.getByTestId("last-name");
        this.emailField = page.getByTestId("email");
        this.passwordField = page.getByTestId("password");
        this.confirmPasswordField = page.getByTestId("confirm-password");
        this.registerButton = page.getByTestId("register-button");
    }

    public register(opts: { firstName: string, lastName: string, email: string, password: string; }) {
        this.emailField.fill(opts.email);
        this.firstNameField.fill(opts.firstName);
        this.lastNameField.fill(opts.lastName);
        this.passwordField.fill(opts.password);
        this.confirmPasswordField.fill(opts.password);
        this.registerButton.click();
    }
}
