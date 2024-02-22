import Locators from "../locators";
import { Page, expect } from "@playwright/test";
import { openMenuToCreate, getClipBoard, wait, customApprove, customConfirmTransaction } from "../../single-test/custom-helper"
import { faker } from '@faker-js/faker';

export default class VotingPowerPage extends Locators {

    async selectMarketplaceAndNetwork(page: Page, marketplaceName: string, networkName: string) {
        console.log('selecting Marketplace and Network');
        await page.getByText(this.managementPageLocator.inputSelectMarketplace).click();
        await page.locator(this.commonPageLocator.classOptionDropdown).getByText(marketplaceName).click();
        await page.getByText(this.managementPageLocator.inputSelectNetwork).click();
        await page.locator(this.commonPageLocator.classOptionDropdown).getByText(networkName).click();
    }


    async lockVotes(page: Page, votes = 2, marketplaceName = 'bepro', networkName = 'Mumbai') {
        await this.selectMarketplaceAndNetwork(page, marketplaceName, networkName)
        console.log('locking votes');
        await this.checkValue(page);
        await page.getByTestId(this.managementPageLocator.inputBeproAmountToLock).fill(`${votes}`);
        await page.getByTestId(this.commonPageLocator.btnApproveLock).click();
        await customApprove(page);
        await wait(2000);
        await page.getByTestId(this.managementPageLocator.btnGetVotes).click();
        await page.getByTestId(this.managementPageLocator.modalConfirmGetVotes).click();
        await customConfirmTransaction(page);
    }

    async unlockVotes(page: Page, votes = 2, marketplaceName = 'bepro', networkName = 'Mumbai') {
        await this.selectMarketplaceAndNetwork(page, marketplaceName, networkName)
        console.log('unlocking votes');
        await page.getByTestId(this.managementPageLocator.tabUnlock).click();
        await page.getByTestId(this.managementPageLocator.inputBeproVotesAmountToUnlock).fill(`${votes}`);
        await page.getByTestId(this.managementPageLocator.btnGetVotes).click();
        await page.getByTestId(this.managementPageLocator.modalConfirmGetVotes).click();
        await customConfirmTransaction(page);
    }

    async unlockAllVotes(page: Page, marketplaceName = 'bepro', networkName = 'Mumbai') {
        await this.selectMarketplaceAndNetwork(page, marketplaceName, networkName)
        console.log('unlocking all votes');
        await page.getByTestId(this.managementPageLocator.tabUnlock).click();
        await page.locator('div.mt-4 > div > div > div:nth-of-type(1) div.my-2 > span').click();
        await page.getByTestId(this.managementPageLocator.btnGetVotes).click();
        await page.getByTestId(this.managementPageLocator.modalConfirmGetVotes).click();
        await customConfirmTransaction(page);
    }

    async checkValue(page: Page) {
        const beproAvailable = await page.getByText('TBEPRO Available').textContent();
        if (beproAvailable?.includes('0 TBEPRO Available')) {
            console.log(beproAvailable);
            
            await wait(2000);
            this.checkValue(page);
        } else {
            console.log('Page loaded');
            await wait(1000);
        }
    }

    async checkCuratorStatus(page: Page) {
        console.log('checking curator status');
        await page.getByTestId(this.commonPageLocator.btnSettings).first().click();
        await page.getByTestId(this.managementPageLocator.btnCopyAddress).click();
        await page.getByTestId(this.commonPageLocator.btnMarketPlaces).click();
        await page.getByTestId(this.commonPageLocator.beproMarketPlace).click();
        await page.getByTestId(this.commonPageLocator.btnCurators).click();
        await wait(2000);
        await page.getByTestId(this.curatorsPageLocator.inputSearchBar).fill(await getClipBoard(page));
        await expect(page.locator('div.p-3')).toHaveCount(1);
        console.log('curator status ok');
    }

}