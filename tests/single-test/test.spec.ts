import { BrowserContext, expect, test as baseTest } from "@playwright/test";
import { openSettingsPage, getRandomInt, getRandomFloat } from "./custom-helper";
import dappwright, { Dappwright, MetaMaskWallet } from "@tenkeylabs/dappwright";
import { firstSignIn, switchAccountAndConnect } from "./custom-helper";
import { environment } from "../../network-config";
import Locators from "../pages/locators";
import TaskPage from "../pages/task/task-page";
import MarketplacePage from "../pages/marketplace/marketplace-page";
import { VotingPowerPage, GovernancePage, RegistryPage} from "../pages/profile";
const taskPage = new TaskPage();
const marketplacePage = new MarketplacePage();
const votingPowerPage = new VotingPowerPage();
const governancePage = new GovernancePage();
const registryPage = new RegistryPage();
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

    await wallet.importPK(environment.PRIVATE_KEY_CREATE_NETWORK);
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
  await firstSignIn(page);
});

test.afterEach(async ({ page }) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await page.close();
});

test("should be able to create a task sucessfully", async ({ page }) => {
  await taskPage.createTask(page);
  await taskPage.changeTaskTags(page);
  await taskPage.changeTaskDescription(page);
  await taskPage.changeTaskValue(page);
  await taskPage.createDeliverable(page);
  await taskPage.createProposal(page);
  await taskPage.acceptProposal(page);

});

test("should be able to cancel a task sucessfully", async ({ page }) => {
  await taskPage.createTask(page);
  await taskPage.cancelTask(page);

});

test("should be able to create a funding request sucessfully", async ({ page }) => {
  await taskPage.createFundingRequest(page);

});

test("should be able to create a funding request with reward sucessfully", async ({ page }) => {
  await taskPage.createFundingRequestWithReward(page);

});

test('should be able to create a marketplace sucessfully', async ({ page, wallet }) => {
  await switchAccountAndConnect(page, wallet, 4);
  await marketplacePage.createMarketplace(page);
});

test('should be able to close a marketplace sucessfully', async ({ page, wallet }) => {
  await switchAccountAndConnect(page, wallet, 4);
  await marketplacePage.closeMarketplace(page);
});

test('should lock voting succesfully', async ({ page }) => {
  await openSettingsPage(page, locators.commonPageLocator.btnVotingPowerProfileMenu);
  await votingPowerPage.selectMarketplaceAndNetwork(page, 'bepro', 'Mumbai');
  await votingPowerPage.lockVotes(page, 1000);
});
test('should unlock votes successfully', async ({ page }) => {
  await openSettingsPage(page, locators.commonPageLocator.btnVotingPowerProfileMenu);
  await votingPowerPage.selectMarketplaceAndNetwork(page, 'bepro', 'Mumbai');
  await votingPowerPage.unlockVotes(page, 1000);
});
test('should change Governor options successfully', async ({ page }) => {
  await openSettingsPage(page, locators.commonPageLocator.btnCustomMarketplaceProfileMenu);
  await governancePage.setDisputeTime(page, await getRandomInt(60, 1728000));
  await governancePage.setPercentageForDispute(page, await getRandomFloat(1, 51));
  await governancePage.setDraftTime(page, await getRandomInt(60, 1728000));
  await governancePage.setCuratorAmount(page, await getRandomInt(1, 10000));
  await governancePage.setMergerFee(page, await getRandomFloat(0, 10));
  await governancePage.setProposalCreatorFee(page, await getRandomFloat(0, 10));

});

test('should change registry options successfully', async ({ page }) => {
  await openSettingsPage(page, locators.commonPageLocator.btnCustomMarketplaceProfileMenu);
  await registryPage.setCancelFee(page, await getRandomFloat(0, 100));
  await registryPage.setCloseFee(page, await getRandomFloat(0, 90));
  await registryPage.setMarketplaceCreationFee(page, await getRandomFloat(0, 99));
  await registryPage.setMarketplaceCreationAmount(page, await getRandomInt(0, 50000));
});

// test('', async ({ page }) => {

// });

// test('', async ({ page }) => {

// });

// test('', async ({ page }) => {

// });