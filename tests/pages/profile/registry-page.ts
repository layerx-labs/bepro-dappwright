import Locators from "../locators";
import { Page, expect } from "@playwright/test";
import { tryToChangeParameters, wait } from "../../single-test/custom-helper"

export default class RegistryPage extends Locators {

    async setRegistrySettings(page: Page, configToChange: string, valueToChange: number, saveButton: string) {
        console.log('changing settings');
        await page.getByTestId(this.managementPageLocator.tabRegistry).click();
        await tryToChangeParameters(page, configToChange, valueToChange, saveButton);

        if(await page.getByText('Changing Marketplace Creation Fee').isVisible()){
            await expect(page.getByText('Changing Marketplace Creation Fee')).not.toBeVisible({timeout: 20000});
        }
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