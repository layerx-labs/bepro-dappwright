import Locators from "pages/locators";
import { faker } from '@faker-js/faker';
import { Page, expect } from "@playwright/test";
import { openMenuToCreate, wait, createDescription, customApprove, customConfirmTransaction, customSign } from "tests/single-test/custom-helper"
import path from "path"

export default class MarketplacePage extends Locators {
    createMarketplaceName() {
        const mp = faker.company.name();
        return mp.toString();
    }

    async createMarketplace(page: Page) {
        await openMenuToCreate(page, this.commonPageLocator.btnCreateYourMarketplace);
        await page.getByTestId(this.marketplacePageLocator.btnSelectNetworkNextStep).click();

        await wait(5000);
        expect(page.locator('.d-flex.flex-wrap')).not.toBeFalsy();
        if (await page.locator('div.bg-dark-gray > div.align-items-center span').textContent() !== '100%') {
            await page.getByText(this.elementText.btnMax, { exact: true }).click();
            await wait(2000);
            if (await page.getByTestId(this.commonPageLocator.btnApproveLock).isVisible()) {
                await page.getByTestId(this.commonPageLocator.btnApproveLock).click();
                await customApprove(page);
                await wait(2000);
            }
            await page.getByTestId(this.marketplacePageLocator.btnLockTBepro).click();
            await customConfirmTransaction(page);
        }
        await wait(2000);
        await page.getByText(this.elementText.btnNextStep).last().click();

        const absolutPath = `${path.resolve('./')}/fixtures`;
        await page.getByTestId(this.marketplacePageLocator.logoIcon).setInputFiles(`${absolutPath}/Bepro-ico.svg`);
        await page.getByTestId(this.marketplacePageLocator.fullLogo).setInputFiles(`${absolutPath}/Bepro-logo.svg`);
        await page.getByTestId(this.marketplacePageLocator.inputMarketplaceName).fill(this.createMarketplaceName());
        await page.getByTestId(this.commonPageLocator.textareaDescriptionCreateTaskDeliverableOrMarketplace).fill(await createDescription());
        await page.getByTestId(this.marketplacePageLocator.btnMarketplaceInformationNextStep).click();

        await page.getByTestId(this.marketplacePageLocator.inputDisputeTime).fill('60');
        await page.getByTestId(this.marketplacePageLocator.inputDraftTime).fill('60');
        await page.getByTestId(this.marketplacePageLocator.inputCuratorAmount).fill('1000');
        await page.getByTestId(this.marketplacePageLocator.btnMarketplaceSettingsNextStep).click();
        //dropdown 
        await page.locator(this.marketplacePageLocator.dropdownTransactionalTokens).click();
        await page.getByTestId(this.marketplacePageLocator.beproTransactionalTokens).click();
        await page.locator(this.marketplacePageLocator.dropdownRewardTokens).click();
        await page.getByTestId(this.marketplacePageLocator.beproRewardTokens).click();

        await page.getByTestId(this.marketplacePageLocator.btnCreateMarketplace).click();

        await customSign(page, false);
        await customConfirmTransaction(page, false);
        await customConfirmTransaction(page, false);
        await customConfirmTransaction(page, false);
        await customConfirmTransaction(page, false);
    }

    async openProfilePage(page: Page, element: string) {
        await page.getByTestId(this.commonPageLocator.profileIcon).click();
        await page.getByText(element).click();
    }

    async closeMarketplace(page: Page) {
        await this.openProfilePage(page, this.commonPageLocator.btnCustomMarketplaceProfileMenu);
        await page.getByTestId(this.managementPageLocator.tabGovernance).click();
        await page.getByTestId(this.managementPageLocator.btnCloseMarketplace).click();
        await customConfirmTransaction(page,false);
    }
}