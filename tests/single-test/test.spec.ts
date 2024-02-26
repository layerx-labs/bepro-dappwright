import { BrowserContext, expect, test as baseTest } from "@playwright/test";
import { openSettingsPage, getRandomInt, getRandomFloat } from "./custom-helper";
import dappwright, { Dappwright, MetaMaskWallet } from "@tenkeylabs/dappwright";
import { firstSignIn, switchAccountAndConnect, wait } from "./custom-helper";
import { environment } from "../../network-config";
import Locators from "../pages/locators";
import TaskPage from "../pages/task/task-page";
import MarketplacePage from "../pages/marketplace/marketplace-page";
import { VotingPowerPage, GovernancePage, RegistryPage } from "../pages/profile";
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

test.afterEach(async ({ context }) => {
  await wait(2000);
  await context.close();
});

test('should change return Governor and Registry options to default successfully', async ({ page }) => {
  await governancePage.setDisputeTime(page);
  await governancePage.setPercentageForDispute(page);
  await governancePage.setDraftTime(page);
  await governancePage.setCuratorAmount(page);
  await governancePage.setMergerFee(page);
  await governancePage.setProposalCreatorFee(page);
  await registryPage.setCancelFee(page);
  await registryPage.setCloseFee(page);
  await registryPage.setMarketplaceCreationFee(page);
  await registryPage.setMarketplaceCreationAmount(page);
});

test("should be able to create a task sucessfully", async ({ page }) => {
  test.setTimeout(600000);
  await governancePage.setDraftTime(page, 120);
  await taskPage.createTask(page);
  await expect(page.getByText('Draft').first()).toBeInViewport({ timeout: 20000 });
  await taskPage.changeTaskTags(page);
  await expect(page.getByText(locators.elementText.toastySuccess)).toBeInViewport({ timeout: 20000 });
  await taskPage.changeTaskDescription(page);
  await expect(page.getByText(locators.elementText.toastySuccess)).toBeVisible({ timeout: 20000 });
  await taskPage.changeTaskValue(page);
  await expect(page.getByText(locators.elementText.toastySuccess)).toBeVisible({ timeout: 20000 });
  await taskPage.createDeliverable(page);
  await taskPage.createProposal(page);
  await taskPage.acceptProposal(page);
  await expect(page.getByText(locators.elementText.textAccepted).first()).toBeVisible({ timeout: 20000 });
  await governancePage.setDraftTime(page);
});

test("should be able to cancel a deliverable sucessfully", async ({ page }) => {
  test.setTimeout(600000);
  await taskPage.createTask(page);
  await expect(page.getByText('Draft').first()).toBeInViewport({ timeout: 20000 });
  await taskPage.createDeliverable(page);
  await taskPage.cancelDeliverable(page);
  await expect(page.getByText(locators.elementText.toastySuccess)).toBeVisible({ timeout: 20000 });
  expect(page.getByTestId('deliverable-state').textContent()).toBe('Canceled');
});

test("should be able to dispute a proposal sucessfully", async ({ page }) => {
  test.setTimeout(600000);
  await governancePage.setDraftTime(page, 120);
  await taskPage.createTask(page);
  await expect(page.getByText('Draft').first()).toBeInViewport({ timeout: 20000 });
  await taskPage.createDeliverable(page);
  await taskPage.createProposal(page);
  await taskPage.disputeProposal(page);
  await expect(page.getByText(locators.elementText.textAccepted).first()).toBeVisible({ timeout: 20000 });
  await governancePage.setDraftTime(page);
});

test("should be able to cancel a task sucessfully", async ({ page }) => {
  await registryPage.setCancelFee(page);
  await governancePage.setDraftTime(page, 120);
  await taskPage.createTask(page);
  await taskPage.cancelTask(page);
  await expect(page.getByText('Canceled')).toBeVisible({ timeout: 20000 });
  await governancePage.setDraftTime(page);
});

test("should be able to create a funding request sucessfully", async ({ page }) => {
  test.setTimeout(600000);
  await taskPage.createFundingRequest(page);
  await taskPage.fundIt(page);
  await taskPage.createDeliverable(page);
  await taskPage.createProposal(page);
  await taskPage.acceptProposal(page);
  await expect(page.getByText(locators.elementText.textAccepted).first()).toBeVisible({ timeout: 20000 });

});

test("should be able to create a funding request with reward sucessfully", async ({ page }) => {
  test.setTimeout(600000);
  await taskPage.createFundingRequestWithReward(page);
  await taskPage.fundIt(page);
  await taskPage.createDeliverable(page);
  await taskPage.createProposal(page);
  await taskPage.acceptProposal(page);
  await expect(page.getByText(locators.elementText.textAccepted).first()).toBeVisible({ timeout: 20000 });
  await taskPage.withdraw(page);
  await expect(page.getByText(locators.elementText.toastySuccess)).toBeVisible({ timeout: 20000 });
});

test('should be able to create a marketplace sucessfully', async ({ page, wallet }) => {
  await registryPage.setMarketplaceCreationAmount(page);
  await registryPage.setMarketplaceCreationFee(page);
  await switchAccountAndConnect(page, wallet, 4);
  await marketplacePage.createMarketplace(page);
  await expect(page.getByTestId(locators.marketplacePageLocator.btnCreateOne)).toBeVisible({ timeout: 60000 });
});

test('should be able to close a marketplace sucessfully', async ({ page, wallet }) => {
  await switchAccountAndConnect(page, wallet, 4);
  await marketplacePage.closeMarketplace(page);
  await expect(page.getByText(locators.elementText.toastySuccess)).toBeVisible({ timeout: 30000 });
});

test('should lock voting succesfully', async ({ page }) => {
  await openSettingsPage(page, locators.commonPageLocator.btnVotingPowerProfileMenu);
  await votingPowerPage.lockVotes(page, 1000);
});

test('should unlock votes successfully', async ({ page }) => {
  await openSettingsPage(page, locators.commonPageLocator.btnVotingPowerProfileMenu);
  await votingPowerPage.unlockVotes(page, 1000);
});

test('should delegate votes successfully', async ({ page }) => {
  await openSettingsPage(page, locators.commonPageLocator.btnVotingPowerProfileMenu);
  await votingPowerPage.delegateVotes(page, 5);
  await expect(page.getByText(locators.elementText.toastySuccess)).toBeVisible({ timeout: 20000 });
});

test('should change curator amount and still be a curator', async ({ page }) => {
  await governancePage.setCuratorAmount(page, 50);
  await page.getByTestId(locators.commonPageLocator.btnVotingPowerProfileMenu).first().click();
  await votingPowerPage.lockVotes(page, 100);
  await page.getByTestId(locators.commonPageLocator.btnCustomMarketplaceProfileMenu).first().click();
  await governancePage.setCuratorAmount(page, 80);
  await votingPowerPage.checkCuratorStatus(page);
});

test('should change Governor options successfully', async ({ page }) => {
  await governancePage.setDisputeTime(page, await getRandomInt(60, 1728000));
  await governancePage.setPercentageForDispute(page, await getRandomFloat(1, 51));
  await governancePage.setDraftTime(page, await getRandomInt(60, 1728000));
  await governancePage.setCuratorAmount(page, await getRandomInt(1, 10000));
  await governancePage.setMergerFee(page, await getRandomFloat(0, 10));
  await governancePage.setProposalCreatorFee(page, await getRandomFloat(0, 10));
});

test('should change registry options successfully', async ({ page }) => {
  await registryPage.setCancelFee(page, await getRandomFloat(0, 100));
  await registryPage.setCloseFee(page, await getRandomFloat(0, 90));
  await registryPage.setMarketplaceCreationFee(page, await getRandomFloat(0, 99));
  await registryPage.setMarketplaceCreationAmount(page, await getRandomInt(0, 50000));
});

// test('', async ({ page }) => {

// });