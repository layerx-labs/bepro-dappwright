import Locators from "pages/locators";
import { Page, expect } from "@playwright/test";
import { getClipBoard, wait, customApprove, customConfirmTransaction } from "tests/single-test/custom-helper";
import { environment } from "network-config";
import { FIVE_SECONDS, TWO_SECONDS } from "utils/constants";

export default class VotingPowerPage extends Locators {

    async selectMarketplaceAndNetwork(page: Page, marketplaceName = 'bepro', networkName = environment.NETWORK_NAME) {
        await page.getByText(this.managementPageLocator.inputSelectMarketplace).click();
        await page.locator(this.commonPageLocator.classOptionDropdown).getByText(marketplaceName).click();
        await page.getByText(this.managementPageLocator.inputSelectNetwork).click();
        await page.locator(this.commonPageLocator.classOptionDropdown).getByText(networkName).click();
    }

    async delegateVotes(page: Page, votes = 2, toAddress = environment.WALLET_ADDRESS_CREATE_NETWORK, marketplaceName = 'bepro', networkName = environment.NETWORK_NAME) {
        await this.selectMarketplaceAndNetwork(page, marketplaceName, networkName)
        await this.checkValue(page);
        await page.getByTestId(this.managementPageLocator.inputDelegateVotesAmount).fill(`${votes}`);
        await page.getByTestId(this.managementPageLocator.inputDelegateVotesAddress).fill(`${toAddress}`);
        await page.getByTestId(this.managementPageLocator.btnDelegateVotes).click();
        await customConfirmTransaction(page);
    }

    async lockVotes(page: Page, votes = 2, marketplaceName = 'bepro', networkName = environment.NETWORK_NAME) {
        await this.selectMarketplaceAndNetwork(page, marketplaceName, networkName)
        await wait(FIVE_SECONDS);
        await this.checkValue(page);
        await page.getByTestId(this.managementPageLocator.oraclesActionsMax).click();
        await wait(FIVE_SECONDS);
        const previousAmount = 
            await page.getByTestId(this.managementPageLocator.inputBeproVotesAmountToUnlock).inputValue();
        await page.getByTestId(this.managementPageLocator.inputBeproAmountToLock).fill(`${votes}`);
        await wait(TWO_SECONDS);
        if (!await page.getByTestId(this.commonPageLocator.btnApproveLock).isDisabled()) {
            await page.getByTestId(this.commonPageLocator.btnApproveLock).click();
            await customApprove(page);
        }
        await page.getByTestId(this.managementPageLocator.btnGetVotes).click();
        await page.getByTestId(this.managementPageLocator.modalConfirmGetVotes).click();
        await customConfirmTransaction(page);
        await page.getByTestId(this.managementPageLocator.oraclesActionsMax).click();
        await wait(FIVE_SECONDS);
        const currentAmount = 
            await page.getByTestId(this.managementPageLocator.inputBeproVotesAmountToUnlock).inputValue();
        return { 
            previousAmount: parseFloat(previousAmount.replaceAll(",", "")), 
            currentAmount: parseFloat(currentAmount.replaceAll(",", "")), 
        };
    }

    async unlockVotes(page: Page, votes = 2, marketplaceName = 'bepro', networkName = environment.NETWORK_NAME) {
        await this.selectMarketplaceAndNetwork(page, marketplaceName, networkName);
        await wait(FIVE_SECONDS);
        await page.getByTestId(this.managementPageLocator.tabUnlock).click();
        await page.getByTestId(this.managementPageLocator.oraclesActionsMax).click();
        await wait(FIVE_SECONDS);
        const previousAmount = 
            await page.getByTestId(this.managementPageLocator.inputBeproVotesAmountToUnlock).inputValue();
        await page.getByTestId(this.managementPageLocator.inputBeproVotesAmountToUnlock).fill(`${votes}`);
        await wait(TWO_SECONDS);
        await page.getByTestId(this.managementPageLocator.btnGetVotes).click();
        await page.getByTestId(this.managementPageLocator.modalConfirmGetVotes).click();
        await customConfirmTransaction(page, true);
        await page.getByTestId(this.managementPageLocator.oraclesActionsMax).click();
        await wait(FIVE_SECONDS);
        const currentAmount = 
            await page.getByTestId(this.managementPageLocator.inputBeproVotesAmountToUnlock).inputValue();
        return { 
            previousAmount: parseFloat(previousAmount.replaceAll(",", "")), 
            currentAmount: parseFloat(currentAmount.replaceAll(",", "")), 
        };
    }

    async unlockAllVotes(page: Page, marketplaceName = 'bepro', networkName = environment.NETWORK_NAME) {
        await this.selectMarketplaceAndNetwork(page, marketplaceName, networkName)
        await page.getByTestId(this.managementPageLocator.tabUnlock).click();
        await page.locator('div.mt-4 > div > div > div:nth-of-type(1) div.my-2 > span').click();
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
            await wait(1000);
        }
    }

    async checkCuratorStatus(page: Page) {
        await page.getByTestId(this.commonPageLocator.btnSettings).first().click();
        await page.getByTestId(this.managementPageLocator.btnCopyAddress).click();
        await page.getByTestId(this.commonPageLocator.btnMarketPlaces).click();
        await page.getByTestId(this.commonPageLocator.beproMarketPlace).click();
        await page.getByTestId(this.commonPageLocator.btnCurators).click();
        await wait(2000);
        await page.getByTestId(this.curatorsPageLocator.inputSearchBar).fill(await getClipBoard(page));
        await expect(page.locator('div.p-3')).toHaveCount(1);
    }

}