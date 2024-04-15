import { Page } from "@playwright/test";
import Locators from "pages/locators";
import { faker } from '@faker-js/faker';
import { connectMetaMask } from "actions/auth/connect-metamask";
import { environment } from "network-config";
import { truncateAddress } from "utils/string";
const locators = new Locators();

export const waitForChromeState = async (page: Page): Promise<void> => {
    await page.waitForTimeout(3000);
};

export const clickOnButton = async (page: Page, text: string): Promise<void> => {
    await page.getByRole('button', { name: text, exact: true }).click();
};

export const connect = async (popup: Page, address: string): Promise<void> => {
    await popup.waitForLoadState();
    await popup.bringToFront();
    await popup.locator('input[type="checkbox"]').first().click();
    await popup.locator('input[type="checkbox"]').first().click();
    await popup.getByText(truncateAddress(address.toLowerCase())).click();
    await wait(500);
    await clickOnButton(popup, 'Next');
    await clickOnButton(popup, 'Connect');
};

export const performPopupAction = async (page: Page, action: (popup: Page) => Promise<void>): Promise<void> => {
    const popup = await page.context().waitForEvent('page');
    await action(popup);
    if (!popup.isClosed()) await popup.waitForEvent('close');
};

export const customSignin = async (page: Page, address: string): Promise<void> => {
    await performPopupAction(page, async (popup) => {
        await popup.waitForSelector('#app-content .app');
        const signatureTextVisible = await popup.getByText('Signature request').isVisible();
        if (!signatureTextVisible) {
            await connect(popup, address);
        }
        await clickOnButton(popup, 'Sign');
        await waitForChromeState(page);
    });
  };

export async function signIn(page: Page, address: string = environment.WALLET_ADDRESS): Promise<void> {
    await connectMetaMask(page);
    await customSignin(page, address);
}

export async function firstSignIn(page: Page): Promise<void> {
    await signIn(page);
    await page.locator(locators.commonPageLocator.btnAcceptCookies).click();
    await page.getByTestId(locators.explorePageLocator.btnExplore).click();
}

async function waitForTransactionComplete(page: Page) {
    await wait(2000)
    let status = await page.$('.stats');
    let textStatus = await status?.textContent();
    if (textStatus === 'Pending') {
        await waitForTransactionComplete(page);
    } else {
        await wait(3000);
    }
}

export async function wait(time: number) {
    await new Promise((resolve) => setTimeout(resolve, time));
}

export async function customSign(page: Page, waitForTransaction: boolean = true) {
    const popup = await page.context().waitForEvent('page');
    await popup.waitForLoadState();
    await popup.bringToFront();
    await popup.getByTestId("page-container-footer-next").click();
    if (waitForTransaction) {
        await waitForTransactionComplete(page);
    }
};

export async function customApprove(page: Page, waitForTransaction: boolean = true): Promise<void> {
    const popup = await page.context().waitForEvent('page');
    await popup.waitForLoadState();
    await popup.bringToFront();
    if (await popup.locator(".token-allowance-container").count())
        await popup.locator(".token-allowance-container").scrollIntoViewIfNeeded();
    await popup.getByTestId("page-container-footer-next").click();
    await wait(1000);
    await popup.getByTestId("page-container-footer-next").click();
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
    const popup = await page.context().waitForEvent('page');
    await popup.waitForLoadState();
    await popup.bringToFront();
    await popup.getByTestId("page-container-footer-next").click();
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
    await popup.getByTestId("signature-request-scroll-button").click();
    await popup.getByTestId("page-container-footer-next").click();
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

export async function switchAccountAndConnect(page: Page, address: string): Promise<void> {
    await page.getByTestId(locators.commonPageLocator.profileIcon).click();
    await page.getByTestId(locators.commonPageLocator.btnDisconnectWallet).click();
    await page.bringToFront();
    await wait(3000);
    await signIn(page, address);
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
        await wait(1000);
        await tryToChangeParameters(page, configToChange, valueToChange, saveButton)
    } else if (await page.getByTestId(configToChange).inputValue() == await formatValue(valueToChange)) {
        await page.getByTestId(locators.managementPageLocator.tabLogoAndColors).click();
        return;
    } else if (await page.getByTestId(configToChange).inputValue() != `${valueToChange}` && await page.getByTestId(configToChange).inputValue() != '0') {
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
        await botaoApprove.click();
        return true;
    } else if (approve) {
        await approve.click();
        return true;
    } else {
        return false;
    }
}