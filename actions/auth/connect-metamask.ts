
import { Page } from "playwright-core";
import { ConnectWalletButton, RKMetaMask } from "actions/auth/locators";

export async function connectMetaMask(page: Page) {
  await page.locator(ConnectWalletButton).click();
  await page.locator(RKMetaMask).click();
}