import { BrowserContext, Page, expect, test } from "@playwright/test";
import { Dappwright } from "@tenkeylabs/dappwright";

import { withMetaMaskTest } from "helpers/with-metamask-test";
import { environment } from "network-config";

import { AvatarOrIdenticon } from "locators/common";
import { connectMetaMask } from "actions/auth/connect-metamask";
import { ConnectWalletButton, RKMetaMask } from "actions/auth/locators";
import { wait } from "utils/wait";
import { customSignin } from "../single-test/custom-helper";

let context: BrowserContext;
let wallet: Dappwright;
let page: Page;

test.beforeEach(async () => {
  const bootstrap = await withMetaMaskTest();

  context = bootstrap.context;
  wallet = bootstrap.wallet;
  page = bootstrap.page;

  await page.route("https://verify.walletconnect.org/bc2288336095f20ebf8653a1ab670566", async route => {
    await route.fulfill()
  });

  await page.route("https://verify.walletconnect.com/bc2288336095f20ebf8653a1ab670566", async route => {
    await route.fulfill()
  });

  await page.goto(environment.BASE_URL);
  console.log("Waiting 10s for page load")
  await wait(10000);
});

test.afterEach(async () => {
  await context.close();
});

test.only("Should signin sucessfully", async () => {
  await connectMetaMask(page);
  await customSignin(page, environment.WALLET_ADDRESS_CREATE_NETWORK);
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