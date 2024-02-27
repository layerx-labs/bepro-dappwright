import Locators from "../locators";
import { Page, expect } from "@playwright/test";
import { openSettingsPage, tryToChangeParameters, wait } from "../../single-test/custom-helper"

export default class GovernancePage extends Locators {

    async setGovernorSettings(page: Page, configToChange: string, valueToChange: number, saveButton: string) {
        console.log('Changing settings');
        const span = await page.waitForSelector('span:text("Governance")', { timeout: 10000 }).catch(() => null)
        if (!span) {
            console.log('marketplace options page not opened');
            await openSettingsPage(page, this.commonPageLocator.btnCustomMarketplaceProfileMenu);
        }
        await page.getByTestId(this.managementPageLocator.tabGovernance).click();
        await tryToChangeParameters(page, configToChange, valueToChange, saveButton);
        await page.waitForFunction(() => !document.querySelector('.spinner-border'), { timeout: 60000 });
        expect(await page.$$('.spinner-border')).toHaveLength(0);

        await wait(500);
        await page.reload();
    }

    async setDisputeTime(page: Page, disputeTime = 60) {
        await this.setGovernorSettings(page, this.managementPageLocator.inputDisputeTime, disputeTime, this.managementPageLocator.btnSaveChanges);
    }

    async setPercentageForDispute(page: Page, percentageForDispute = 3) {
        await this.setGovernorSettings(page, this.managementPageLocator.inputPercentageForDispute, percentageForDispute, this.managementPageLocator.btnSaveChanges);
    }

    async setDraftTime(page: Page, draftTime = 60) {
        await this.setGovernorSettings(page, this.managementPageLocator.inputDraftTime, draftTime, this.managementPageLocator.btnSaveChanges);
    }

    async setCuratorAmount(page: Page, curatorAmount = 10000) {
        await this.setGovernorSettings(page, this.managementPageLocator.inputCuratorAmount, curatorAmount, this.managementPageLocator.btnSaveChanges);
    }

    async setMergerFee(page: Page, mergerFee = 0.05) {
        await this.setGovernorSettings(page, this.managementPageLocator.inputMergerFee, mergerFee, this.managementPageLocator.btnSaveChanges);
    }

    async setProposalCreatorFee(page: Page, proposalCreatorFee = 2) {
        await this.setGovernorSettings(page, this.managementPageLocator.inputProposalCreatorFee, proposalCreatorFee, this.managementPageLocator.btnSaveChanges);
    }

}