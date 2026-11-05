import { Locator, Page } from "@playwright/test";

export default class Header {

    profileButton: Locator;

    constructor(private page: Page) {
        this.profileButton = page.getByTestId("profile-button");
    }
}
