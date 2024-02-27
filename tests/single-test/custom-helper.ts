import { Page, expect } from "@playwright/test";
import { Dappwright } from "@tenkeylabs/dappwright";
import Locators from "../pages/locators";
import { faker } from '@faker-js/faker';
const locators = new Locators();

export async function firstSignIn(page: Page): Promise<void> {
    await page.locator('[data-testid="connect-wallet-button"]').click();
    await page.locator('[data-testid="rk-wallet-option-io.metamask"]').click();
    const popup = await page.context().waitForEvent('page');
    await popup.waitForLoadState();
    await popup.bringToFront();
    await popup.locator('input[type="checkbox"]').first().check();
    await popup.locator("[data-testid='page-container-footer-next']").click();
    await popup.waitForLoadState();
    await popup.locator("[data-testid='page-container-footer-next']").click();
    await popup.locator(".request-signature__body").scrollIntoViewIfNeeded();
    await popup.locator("[data-testid='page-container-footer-next']").click();
    await page.locator(locators.commonPageLocator.btnAcceptCookies).click();
    await page.getByTestId(locators.explorePageLocator.btnExplore).click();
}

async function waitForTransactionComplete(page: Page) {
    await wait(2000)
    let status = await page.$('.stats');
    let textStatus = await status?.textContent();
    console.log('status: ', status?.textContent());
    if (textStatus === 'Pending') {
        await waitForTransactionComplete(page);
    } else {
        console.log('done');
        await wait(3000);
    }
}

export async function wait(time: number) {
    await new Promise((resolve) => setTimeout(resolve, time));
}

export async function customSign(page: Page, waitForTransaction: boolean = true) {
    console.log('Signing');
    const popup = await page.context().waitForEvent('page');
    await popup.waitForLoadState();
    await popup.bringToFront();
    await popup.locator("[data-testid='page-container-footer-next']").click();
    if (waitForTransaction) {
        await waitForTransactionComplete(page);
    }

};

export async function customApprove(page: Page, waitForTransaction: boolean = true): Promise<void> {
    console.log('Approving');
    const popup = await page.context().waitForEvent('page');
    await popup.waitForLoadState();
    await popup.bringToFront();
    await popup.locator("[data-testid='page-container-footer-next']").click();
    await wait(1000);
    await popup.locator("[data-testid='page-container-footer-next']").click();
    if (waitForTransaction) {
        await waitForTransactionComplete(page);
    } else {
        await wait(1000);
    }
    if (await checkApproveDone(page)) {
        await customApprove(page, waitForTransaction);
    }
}

export async function customConfirmTransaction(page: Page, waitForTransaction: boolean = true): Promise<void> {
    console.log('Confirming');
    const popup = await page.context().waitForEvent('page');
    await popup.waitForLoadState();
    await popup.bringToFront();
    await popup.locator("[data-testid='page-container-footer-next']").click();
    if (waitForTransaction) {
        await waitForTransactionComplete(page);
    } else {
        await wait(1000);
    }

}

export async function connectWallet(page: Page): Promise<void> {
    await page.bringToFront();
    await page.getByTestId("connect-wallet-button").click();
    await page.getByText('Metamask').click();
    const popup = await page.context().waitForEvent('page');
    await popup.waitForLoadState();
    await popup.bringToFront();
    await popup.locator("[data-testid='signature-request-scroll-button']").click();
    await popup.locator("[data-testid='page-container-footer-next']").click();
};

export async function openMenuToCreate(page: Page, element: string) {
    await page.getByTestId(locators.commonPageLocator.btnCreate).click();
    await page.getByTestId(element).click();
    await page.getByTestId(locators.commonPageLocator.btnContinueCreation).click();
    await wait(1000);
};


export async function createDescription(): Promise<string> {
    const description = faker.lorem.paragraphs(2, '<br/>\n');
    return description.toString();
};


export async function openSettingsPage(page: Page, element: string) {
    await page.getByTestId(locators.commonPageLocator.profileIcon).first().click();
    await page.getByTestId(element).first().click();
};

export async function switchAccountAndConnect(page: Page, wallet: Dappwright, account: number): Promise<void> {
    await page.getByTestId(locators.commonPageLocator.profileIcon).click();
    await page.getByTestId(locators.commonPageLocator.btnDisconnectWallet).click();
    await wallet.switchAccount(account);
    console.log('Switched to account: ', account);
    await connectWallet(page);
};

export async function getRandomInt(min: number, max: number): Promise<number> {
    max = max === undefined ? min : max;
    min = max === undefined ? 0 : min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export async function getRandomFloat(min: number, max: number): Promise<number> {
    max = max === undefined ? min : max;
    min = max === undefined ? 0 : min;
    const randomNumber = Math.random() * (max - min) + min;
    return parseFloat(randomNumber.toFixed(2));
};

export async function tryToChangeParameters(page: Page, configToChange: string, valueToChange: number, saveButton: string) {

    if (await page.getByTestId(configToChange).inputValue() == '0' || await page.getByTestId(configToChange).inputValue() == '') {
        console.log('value: 0');
        await wait(1000);
        await tryToChangeParameters(page, configToChange, valueToChange, saveButton)
    } else if (await page.getByTestId(configToChange).inputValue() == await formatValue(valueToChange)) {
        console.log('No need to change the value');
        await page.getByTestId(locators.managementPageLocator.tabLogoAndColors).click();
        return;
    } else if (await page.getByTestId(configToChange).inputValue() != `${valueToChange}` && await page.getByTestId(configToChange).inputValue() != '0') {
        console.log('changing value to : ', valueToChange);
        await page.getByTestId(configToChange).fill(`${valueToChange}`);
        await page.getByTestId(saveButton).first().click();
        await customConfirmTransaction(page);
        return;
    }
}

async function formatValue(number: number): Promise<string> {
    let formatedValue = number.toString();
    formatedValue = formatedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formatedValue;
}

export async function getClipBoard(page: Page): Promise<string> {
    return await page.evaluate(() => {
        return navigator.clipboard.readText();
    });
}

export async function checkApproveDone(page: Page): Promise<boolean> {
    const approve = await page.waitForSelector('button:text("approve")', { timeout: 5000 }).catch(() => null);
    const botaoApprove = await page.waitForSelector('button:text("Approve")', { timeout: 5000 }).catch(() => null);
    if (botaoApprove) {
        console.log('Approve found');
        await botaoApprove.click();
        return true;
    } else if (approve) {
        console.log('approve found');
        await approve.click();
        return true;
    } else {
        console.log('Approve not found');
        return false;
    }
}
