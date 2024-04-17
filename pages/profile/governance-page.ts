import Locators from "pages/locators";
import { Page, expect } from "@playwright/test";
import { openSettingsPage, tryToChangeParameters, wait } from "tests/single-test/custom-helper"

export default class GovernancePage extends Locators {

    async setGovernorSettings(page: Page, configToChange: string, valueToChange: number, saveButton: string, reload = true) {
        const span = await page.waitForSelector('span:text("Governance")', { timeout: 10000 }).catch(() => null)
        if (!span) {
            await openSettingsPage(page, this.commonPageLocator.btnCustomMarketplaceProfileMenu);
        }
        await page.getByTestId(this.managementPageLocator.tabGovernance).click();
        await wait(2000);
        await tryToChangeParameters(page, configToChange, valueToChange, saveButton);
        await page.waitForFunction(() => !document.querySelector('.spinner-border'), { timeout: 60000 });
        expect(await page.$$('.spinner-border')).toHaveLength(0);

        await wait(500);
        if (reload)
            await page.reload();
    }

    async setDisputeTime(page: Page, disputeTime = 60, reload = true) {
        await this.setGovernorSettings(page, this.managementPageLocator.inputDisputeTime, disputeTime, this.managementPageLocator.btnSaveChanges, reload);
    }

    async setPercentageForDispute(page: Page, percentageForDispute = 3, reload = true) {
        await this.setGovernorSettings(page, this.managementPageLocator.inputPercentageForDispute, percentageForDispute, this.managementPageLocator.btnSaveChanges, reload);
    }

    async setDraftTime(page: Page, draftTime = 60, reload = true) {
        await this.setGovernorSettings(page, this.managementPageLocator.inputDraftTime, draftTime, this.managementPageLocator.btnSaveChanges, reload);
    }

    async setCuratorAmount(page: Page, curatorAmount = 10000, reload = true) {
        await this.setGovernorSettings(page, this.managementPageLocator.inputCuratorAmount, curatorAmount, this.managementPageLocator.btnSaveChanges, reload);
    }

    async setMergerFee(page: Page, mergerFee = 0.05, reload = true) {
        await this.setGovernorSettings(page, this.managementPageLocator.inputMergerFee, mergerFee, this.managementPageLocator.btnSaveChanges, reload);
    }

    async setProposalCreatorFee(page: Page, proposalCreatorFee = 2, reload = true) {
        await this.setGovernorSettings(page, this.managementPageLocator.inputProposalCreatorFee, proposalCreatorFee, this.managementPageLocator.btnSaveChanges, reload);
    }

}