import { Page, } from "@playwright/test";
import { Dappwright } from "@tenkeylabs/dappwright";
import Locators from "../pages/locators";
import { faker } from '@faker-js/faker';
const locators = new Locators();

export async function firstSignIn(page: Page): Promise<void> {
    await page.click('[data-testid="connect-wallet-button"]');;
    await page.getByText('Metamask').click();
    const popup = await page.context().waitForEvent('page');
    await popup.waitForLoadState();
    await popup.bringToFront();
    await popup.locator('input[type="checkbox"]').first().check();
    await popup.locator('[data-testid="page-container-footer-next"]').click();
    await popup.waitForLoadState();
    await popup.locator('[data-testid="page-container-footer-next"]').click();
    await popup.locator('[data-testid="signature-request-scroll-button"]').click();
    await popup.locator('[data-testid="page-container-footer-next"]').click();
    await page.click(locators.commonPageLocator.btnAcceptCookies);
    await page.locator(locators.explorePageLocator.btnExplore).click();
}

export async function customApprove(page: Page): Promise<void> {
    const popup = await page.context().waitForEvent('page');
    await popup.waitForLoadState();
    await popup.bringToFront();
    await popup.locator('[data-testid="page-container-footer-next"]').click();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await popup.locator('[data-testid="page-container-footer-next"]').click();
}

export async function customConfirmTransaction(page: Page): Promise<void> {
    const popup = await page.context().waitForEvent('page');
    await popup.waitForLoadState();
    await popup.bringToFront();
    await popup.locator('[data-testid="page-container-footer-next"]').click();
}

export async function connectWallet(page: Page): Promise<void> {
    await page.click('[data-testid="connect-wallet-button"]');;
    await page.getByText('Metamask').click();
    const popup = await page.context().waitForEvent('page');
    await popup.waitForLoadState();
    await popup.bringToFront();
    await popup.locator('[data-testid="page-container-footer-next"]').click();
    await popup.locator('[data-testid="signature-request-scroll-button"]').click();
    await popup.locator('[data-testid="page-container-footer-next"]').click();
};

export async function openMenuToCreate(page: Page, element: string) {
    await page.getByTestId(locators.commonPageLocator.btnCreate).click();
    await page.getByTestId(locators.commonPageLocator.btnLaunchInOpenMarketplace).click();
    await page.getByTestId(locators.commonPageLocator.btnContinueCreation).click();
};


export async function createDescription(): Promise<string> {
    const description = faker.lorem.paragraphs(2, '<br/>\n');
    return description.toString();
};


export async function openSettingsPage(page: Page, element: string) {
    await page.click(locators.commonPageLocator.profileIcon);
    await page.click(element);
};

export async function switchAccountAndConnect(page: Page, wallet: Dappwright, account: number): Promise<void> {
    await page.click(locators.commonPageLocator.profileIcon);
    await page.click(locators.commonPageLocator.btnDisconnectWallet);
    await wallet.switchAccount(account);
    connectWallet(page);
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

