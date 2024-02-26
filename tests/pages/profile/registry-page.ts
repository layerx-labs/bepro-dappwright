import Locators from "../locators";
import { Page, expect } from "@playwright/test";
import { openSettingsPage, tryToChangeParameters, wait } from "../../single-test/custom-helper"

export default class RegistryPage extends Locators {

    async setRegistrySettings(page: Page, configToChange: string, valueToChange: number, saveButton: string) {
        console.log('changing settings');
        const span = await page.waitForSelector('span:text("Registry")', { timeout: 10000 }).catch(() => null)
        if (!span) {
            console.log('marketplace options page not opened');
            await openSettingsPage(page, this.commonPageLocator.btnCustomMarketplaceProfileMenu);
        }
        await page.getByTestId(this.managementPageLocator.tabRegistry).click();
        await tryToChangeParameters(page, configToChange, valueToChange, saveButton);
        await page.waitForFunction(() => !document.querySelector('.spinner-border'), { timeout: 60000 });
        expect(await page.$$('.spinner-border')).toHaveLength(0);

        await wait(500);
        await page.reload();
    }

    async setCancelFee(page: Page, cancelFee = 2) {
        await this.setRegistrySettings(page, this.managementPageLocator.inputCancelFee, cancelFee, this.managementPageLocator.btnSaveChanges);
    }

    async setCloseFee(page: Page, closeFee = 10) {
        await this.setRegistrySettings(page, this.managementPageLocator.inputCloseFee, closeFee, this.managementPageLocator.btnSaveChanges);
    }

    async setMarketplaceCreationFee(page: Page, marketplaceCreationFee = 2) {
        await this.setRegistrySettings(page, this.managementPageLocator.inputMarketplaceCreationFee, marketplaceCreationFee, this.managementPageLocator.btnSaveChanges);
    }

    async setMarketplaceCreationAmount(page: Page, marketplaceCreationAmount = 10000) {
        await this.setRegistrySettings(page, this.managementPageLocator.inputMarketplaceCreationAmount, marketplaceCreationAmount, this.managementPageLocator.btnSaveChanges);
    }

}