import { expect } from "@playwright/test";

import { environment } from "../../network-config";
import { wait } from "../single-test/custom-helper";
import { withCoinbaseTest } from "../helpers/with-coinbase";

const coinbaseSignInTest = withCoinbaseTest();

coinbaseSignInTest.beforeEach(async ({ page }) => {
  await page.goto(environment.BASE_URL);
});

coinbaseSignInTest.afterEach(async ({ context }) => {
  await wait(2000);
  await context.close();
});

coinbaseSignInTest("Should signin sucessfully", async ({ page, wallet }) => {
  await page.locator('[data-testid="connect-wallet-button"]').click();
  await page.locator('[data-testid="rk-wallet-option-coinbase"]').click();
  await wallet.signin();
  await expect(page.locator('[data-testid="avatar-or-identicon"]')).toBeVisible();
  await expect(page.locator('[data-testid="connect-wallet-button"]')).not.toBeVisible();
  await expect(page.locator('[data-testid="rk-wallet-option-coinbase"]')).not.toBeVisible();
});

coinbaseSignInTest("Should not signin because user rejected", async ({ page, wallet }) => {
  await page.locator('[data-testid="connect-wallet-button"]').click();
  await page.locator('[data-testid="rk-wallet-option-coinbase"]').click();
  await wallet.reject();
  await expect(page.locator('[data-testid="connect-wallet-button"]')).toBeVisible();
  await expect(page.locator('[data-testid="avatar-or-identicon"]')).not.toBeVisible();
  await expect(page.locator('[data-testid="rk-wallet-option-coinbase"]')).toBeVisible();
});