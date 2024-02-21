import Locators from "../locators";
import { Page, expect } from "@playwright/test";
import { openMenuToCreate, getRandomInt, wait, customApprove, customConfirmTransaction } from "../../single-test/custom-helper"
import { faker } from '@faker-js/faker';

export default class VotingPowerPage extends Locators {

    async selectMarketplaceAndNetwork(page: Page, marketplaceName = 'bepro', networkName = 'Mumbai') {
        console.log('selecting Marketplace and Network');
        await page.getByText(this.managementPageLocator.inputSelectMarketplace).click();
        await page.locator(this.commonPageLocator.classOptionDropdown).getByText(marketplaceName).click();
        await page.getByText(this.managementPageLocator.inputSelectNetwork).click();
        await page.locator(this.commonPageLocator.classOptionDropdown).getByText(networkName).click();
    }


    async lockVotes(page: Page, votes = 2) {
        console.log('locking votes');
        await page.getByTestId(this.managementPageLocator.inputBeproAmountToLock).fill(`${votes}`);
        await this.checkValue(page);
        await page.getByTestId(this.commonPageLocator.btnApproveLock).click();
        await customApprove(page);
        await page.getByTestId(this.managementPageLocator.btnGetVotes).click();
        await page.getByTestId(this.managementPageLocator.modalConfirmGetVotes).click();
        await customConfirmTransaction(page);
    }

    async unlockVotes(page: Page, votes = 2) {
        console.log('unlocking votes');
        await page.getByTestId(this.managementPageLocator.tabUnlock).click();
        await page.getByTestId(this.managementPageLocator.inputBeproVotesAmountToUnlock).fill(`${votes}`);
        await page.getByTestId(this.managementPageLocator.btnGetVotes).click();
        await page.getByTestId(this.managementPageLocator.modalConfirmGetVotes).click();
        await customConfirmTransaction(page);
    }

    async checkValue(page: Page) {
        const beproAvailable = await page.getByText('TBEPRO Available').textContent();
        if (beproAvailable?.includes('0 TBEPRO Available')) {
            await wait(2000);
            this.checkValue(page);
        } else {
            console.log('Page loaded');
        }
    }

}