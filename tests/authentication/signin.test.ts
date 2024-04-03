import { BrowserContext, Page, expect, test } from "@playwright/test";
import { Dappwright } from "@tenkeylabs/dappwright";

import { withMetaMaskTest } from "helpers/with-metamask-test";
import { environment } from "network-config";

import { AvatarOrIdenticon } from "locators/common";
import { connectMetaMask } from "actions/auth/connect-metamask";
import { ConnectWalletButton, RKMetaMask } from "actions/auth/locators";

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

test.only("Should signin sucessfully", async () => {
  await connectMetaMask(page);
  await wallet.signin();
  await expect(page.locator(AvatarOrIdenticon)).toBeVisible();
  await expect(page.locator(ConnectWalletButton)).not.toBeVisible();
  await expect(page.locator(RKMetaMask)).not.toBeVisible();
});

test("Should not signin because user rejected", async () => {
  await connectMetaMask(page);
  await wallet.reject();
  await expect(page.locator(ConnectWalletButton)).toBeVisible();
  await expect(page.locator(AvatarOrIdenticon)).not.toBeVisible();
  await expect(page.locator(RKMetaMask)).toBeVisible();
});