import Locators from "../locators";
import { Page, expect } from "@playwright/test";
import { tryToChangeParameters, wait } from "../../single-test/custom-helper"

export default class GovernancePage extends Locators {

    async setGovernorSettings(page: Page, configToChange: string, valueToChange: number, saveButton: string) {
        console.log('Changing settings');
        await page.getByTestId(this.managementPageLocator.tabGovernance).click();
        await tryToChangeParameters(page, configToChange, valueToChange, saveButton);

    
        if (await page.getByText(this.elementText.toastySuccess).isVisible()) {
            await expect(page.getByText(this.elementText.toastySuccess)).toBeVisible({ timeout: 60000 });
        }
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