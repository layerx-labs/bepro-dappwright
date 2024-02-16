import { BrowserContext, expect, test as baseTest } from "@playwright/test";
import dappwright, { Dappwright, MetaMaskWallet } from "@tenkeylabs/dappwright";

async function handlePopup(page): Promise<void> {
  const popup = await page.context().waitForEvent('page');
  await popup.waitForLoadState();
  await popup.bringToFront();
  await popup.locator('input[type="checkbox"]').first().check();
  await popup.locator('[data-testid="page-container-footer-next"]').click();
  await popup.waitForLoadState();
  await popup.locator('[data-testid="page-container-footer-next"]').click();
  await popup.locator('[data-testid="signature-request-scroll-button"]').click();
  await popup.locator('[data-testid="page-container-footer-next"]').click();
}

export const test = baseTest.extend<{
  context: BrowserContext;
  wallet: Dappwright;
}>({
  context: async ({}, use) => {
    // Launch context with extension
    const [wallet, _, context] = await dappwright.bootstrap("", {
      wallet: "metamask",
      version: MetaMaskWallet.recommendedVersion,
      seed: "test test test test test test test test test test test junk",
      headless: false,
    });


    await wallet.addNetwork({
      networkName: "Mumbai",
      rpc: "https://rpc.ankr.com/polygon_mumbai/3d46f18e6ed46b2297fd512b8733fd803ee4358667c1b21cc2e4b1f5d5b17c41",
      chainId: 80001,
      symbol: "MATIC",
    });

    await wallet.importPK("0x889bf162087bdc554e4ff2d5f06c9dcaf2063d1674cedd97099f9b7053af517e");
    await use(context);
  },

  wallet: async ({ context }, use) => {
    const metamask = await dappwright.getWallet("metamask", context);

    await use(metamask);
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto("http://afrodite.bepro.network/");
});

test("should be able to connect", async ({ wallet, page, context }) => {
  test.setTimeout(3000000);
  await page.click('[data-testid="connect-wallet-button"]');;
  await page.getByText('Metamask').click();
  await handlePopup(page);
  await new Promise(resolve => setTimeout(resolve, 2000000));
});
