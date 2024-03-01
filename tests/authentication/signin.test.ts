import { BrowserContext, Page, expect, test } from "@playwright/test";
import { Dappwright } from "@tenkeylabs/dappwright";

import { withMetaMaskTest } from "helpers/with-metamask-test";
import { environment } from "network-config";

import { ConnectWalletButton, RKMetaMask } from "locators/auth";
import { AvatarOrIdenticon } from "locators/common";

let context: BrowserContext;
let wallet: Dappwright;
let page: Page;

test.beforeEach(async () => {
  const bootstrap = await withMetaMaskTest();

  context = bootstrap.context;
  wallet = bootstrap.wallet;
  page = bootstrap.page;
  
  await page.goto(environment.BASE_URL);
});

test.afterEach(async () => {
  await context.close();
});

test("Should signin sucessfully", async () => {
  await page.locator(ConnectWalletButton).click();
  await page.locator(RKMetaMask).click();
  await wallet.signin();
  await expect(page.locator(AvatarOrIdenticon)).toBeVisible();
  await expect(page.locator(ConnectWalletButton)).not.toBeVisible();
  await expect(page.locator(RKMetaMask)).not.toBeVisible();
});

test("Should not signin because user rejected", async () => {
  await page.locator(ConnectWalletButton).click();
  await page.locator(RKMetaMask).click();
  await wallet.reject();
  await expect(page.locator(ConnectWalletButton)).toBeVisible();
  await expect(page.locator(AvatarOrIdenticon)).not.toBeVisible();
  await expect(page.locator(RKMetaMask)).toBeVisible();
});