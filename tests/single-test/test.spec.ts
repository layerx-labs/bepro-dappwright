import { BrowserContext, expect, test as baseTest } from "@playwright/test";
import dappwright, { Dappwright, MetaMaskWallet } from "@tenkeylabs/dappwright";
import { openMenuToCreate } from "./custom-helper";
import { firstSignIn } from "./custom-helper";
import { environment } from "../../network-config";
import Locators from "../pages/locators";
import TaskPage from "../pages/task/task-page";
const taskPage = new TaskPage();
const locators = new Locators();

export const test = baseTest.extend<{
  context: BrowserContext;
  wallet: Dappwright;
}>({
  context: async ({ }, use) => {
    // Launch context with extension
    const [wallet, _, context] = await dappwright.bootstrap("", {
      wallet: "metamask",
      version: MetaMaskWallet.recommendedVersion,
      seed: "test test test test test test test test test test test junk",
      headless: false,
    });

    await wallet.addNetwork({
      networkName: environment.NETWORK_NAME,
      rpc: environment.RPC,
      chainId: environment.CHAIN_ID,
      symbol: environment.SYMBOL
    });

    await wallet.importPK(environment.PRIVATE_KEY);
    await use(context);
  },

  wallet: async ({ context }, use) => {
    const metamask = await dappwright.getWallet("metamask", context);

    await use(metamask);
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto(environment.BASE_URL);
});

test("should be able to create a task sucessfully", async ({ wallet, page }) => {
  await firstSignIn(page);
  taskPage.createTask(page);
  taskPage.changeTaskTags(page);
  taskPage.changeTaskValue(page);
  taskPage.createDeliverable(page);
  // taskPage.createProposal(page);
  // taskPage.acceptProposal(page);
  await new Promise((resolve) => setTimeout(resolve, 2000000));

});
