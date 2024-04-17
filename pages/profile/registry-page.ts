import Locators from "pages/locators";
import { Page, expect } from "@playwright/test";
import { openSettingsPage, tryToChangeParameters, wait } from "tests/single-test/custom-helper"

export default class RegistryPage extends Locators {

    async setRegistrySettings(page: Page, configToChange: string, valueToChange: number, saveButton: string, reload = true) {
        const span = await page.waitForSelector('span:text("Registry")', { timeout: 10000 }).catch(() => null)
        if (!span) {
            await openSettingsPage(page, this.commonPageLocator.btnCustomMarketplaceProfileMenu);
        }
        await wait(2000);
        await page.getByTestId(this.managementPageLocator.tabRegistry).click();
        await tryToChangeParameters(page, configToChange, valueToChange, saveButton);
        await page.waitForFunction(() => !document.querySelector('.spinner-border'), { timeout: 10000 });
        expect(await page.$$('.spinner-border')).toHaveLength(0);
        await wait(500);
        if (reload)
            await page.reload();
    }

    async setCancelFee(page: Page, cancelFee = 2, reload = true) {
        await this.setRegistrySettings(page, this.managementPageLocator.inputCancelFee, cancelFee, this.managementPageLocator.btnSaveChanges, reload);
    }

    async setCloseFee(page: Page, closeFee = 10, reload = true) {
        await this.setRegistrySettings(page, this.managementPageLocator.inputCloseFee, closeFee, this.managementPageLocator.btnSaveChanges, reload);
    }

    async setMarketplaceCreationFee(page: Page, marketplaceCreationFee = 2, reload = true) {
        await this.setRegistrySettings(page, this.managementPageLocator.inputMarketplaceCreationFee, marketplaceCreationFee, this.managementPageLocator.btnSaveChanges, reload);
    }

    async setMarketplaceCreationAmount(page: Page, marketplaceCreationAmount = 10000, reload = true) {
        await this.setRegistrySettings(page, this.managementPageLocator.inputMarketplaceCreationAmount, marketplaceCreationAmount, this.managementPageLocator.btnSaveChanges, reload);
    }

}