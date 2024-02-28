import { expect } from "@playwright/test";

import { withMetaMaskTest } from "src/helpers/with-metamask-test";
import { environment } from "network-config";
import { wait } from "src/utils/wait";

const metaMaskSignInTest = withMetaMaskTest();

metaMaskSignInTest.beforeEach(async ({ page }) => {
  await page.goto(environment.BASE_URL);
});

metaMaskSignInTest.afterEach(async ({ context }) => {
  await wait(2000);
  await context.close();
});

metaMaskSignInTest("Should signin sucessfully", async ({ page, wallet }) => {
  await page.locator('[data-testid="connect-wallet-button"]').click();
  await page.locator('[data-testid="rk-wallet-option-io.metamask"]').click();
  await wallet.signin();
  await expect(page.locator('[data-testid="avatar-or-identicon"]')).toBeVisible();
  await expect(page.locator('[data-testid="connect-wallet-button"]')).not.toBeVisible();
  await expect(page.locator('[data-testid="rk-wallet-option-io.metamask"]')).not.toBeVisible();
});

metaMaskSignInTest("Should not signin because user rejected", async ({ page, wallet }) => {
  await page.locator('[data-testid="connect-wallet-button"]').click();
  await page.locator('[data-testid="rk-wallet-option-io.metamask"]').click();
  await wallet.reject();
  await expect(page.locator('[data-testid="connect-wallet-button"]')).toBeVisible();
  await expect(page.locator('[data-testid="avatar-or-identicon"]')).not.toBeVisible();
  await expect(page.locator('[data-testid="rk-wallet-option-io.metamask"]')).toBeVisible();
});