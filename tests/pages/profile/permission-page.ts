import { Page, expect } from "@playwright/test";
import Locators from "../locators";

export default class PermissionPage extends Locators {
    async setBannedDomain(domain: string, page: Page) {
        await page.getByTestId(this.managementPageLocator.tabPermissions).click();
        await page.locator(this.managementPageLocator.inputBannedDomains).fill(domain);
        await page.locator(this.elementText.btnAdd).click()
        await expect(page.locator(this.managementPageLocator.toastySuccess)).toBeVisible( { timeout: 30000 });
        await page.reload();
        await page.getByTestId(this.managementPageLocator.tabPermissions).click();
    }

}