import { Dappwright } from "@tenkeylabs/dappwright";
import { Page } from "playwright-core";

const goHome = async (page: Page): Promise<void> => {
  await page.getByTestId('portfolio-navigation-link').click();
};

export async function importPK(privateKey: string, page: Page, wallet: Dappwright): Promise<void> {
  await page.locator('[data-testid="portfolio-header--switcher-cell-pressable"]').click();
  await page.locator('[data-testid="wallet-switcher--manage"]').click();
  await page.locator('[data-testid="add-and-manage-wallets--importNewSecret-cell-pressable"]').click();
  await page.locator('[data-testid="secret-input"]').fill(privateKey);
  await page.locator('[data-testid="btn-import-wallet"]').click();
  await page.locator('[data-testid="verify-password-input"]').fill("password1234!!!!");
  await page.locator('[data-testid="verify-password-next-btn"]').click();
  await goHome(page);
}