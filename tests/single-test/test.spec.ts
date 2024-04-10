import { test, expect, BrowserContext, Page } from "@playwright/test";
import { openSettingsPage, getRandomInt, getRandomFloat, wait } from "./custom-helper";
import { firstSignIn, switchAccountAndConnect } from "./custom-helper";
import { environment } from "network-config";
import Locators from "pages/locators";
import TaskPage from "pages/task/task-page";
import MarketplacePage from "pages/marketplace/marketplace-page";
import { VotingPowerPage, GovernancePage, RegistryPage } from "pages/profile";
import { withMetaMaskTest } from "helpers/with-metamask-test";
import { Dappwright } from "@tenkeylabs/dappwright";
import { MINUTE, TWO_SECONDS } from "utils/constants";

const taskPage = new TaskPage();
const marketplacePage = new MarketplacePage();
const votingPowerPage = new VotingPowerPage();
const governancePage = new GovernancePage();
const registryPage = new RegistryPage();
const locators = new Locators();

let context: BrowserContext;
let wallet: Dappwright;
let page: Page;

test.beforeAll(async () => {
  const bootstrap = await withMetaMaskTest();

  context = bootstrap.context;
  wallet = bootstrap.wallet;
  page = await context.newPage();

  await page.goto(environment.BASE_URL);
  await firstSignIn(page);
});

test.afterAll(async () => {
  await context.close();
});

test.beforeEach(async () => {
  await page.goto(environment.BASE_URL);
});

test('should change return Governor and Registry options to default successfully', async () => {
  await governancePage.setDisputeTime(page, undefined, false);
  await governancePage.setPercentageForDispute(page, undefined, false);
  await governancePage.setDraftTime(page), undefined, false;
  await governancePage.setCuratorAmount(page, undefined, false);
  await governancePage.setMergerFee(page, undefined, false);
  await governancePage.setProposalCreatorFee(page);
  await registryPage.setCancelFee(page);
  await registryPage.setCloseFee(page);
  await registryPage.setMarketplaceCreationFee(page);
  await registryPage.setMarketplaceCreationAmount(page);
});

test("should be able to create a task sucessfully", async () => {
  test.setTimeout(600000);
  await governancePage.setDraftTime(page, 120);
  await governancePage.setDisputeTime(page, 60);
  await taskPage.createTask(page);
  await expect(page.getByTestId(locators.taskPageLocator.taskStatus)).toHaveText('draft',{ timeout: 30000 });
  await taskPage.changeTaskTags(page);
  await expect(page.getByText(locators.elementText.toastySuccess)).toBeVisible({ timeout: 20000 });
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

test("should be able to cancel a deliverable sucessfully", async () => {
  test.setTimeout(600000);
  await taskPage.createTask(page);
  await expect(page.getByTestId(locators.taskPageLocator.taskStatus)).toHaveText('draft',{ timeout: 30000 });
  await taskPage.createDeliverable(page);
  await taskPage.cancelDeliverable(page);
  await expect(page.getByText(locators.elementText.toastySuccess)).toBeVisible({ timeout: 20000 });
  expect(await page.getByTestId(locators.deliverablePageLocator.deliverableState).first()).toHaveText('Canceled');
});

test("should be able to dispute a proposal sucessfully", async () => {
  test.setTimeout(600000);
  await governancePage.setDisputeTime(page, 120);
  await taskPage.createTask(page);
  await expect(page.getByTestId(locators.taskPageLocator.taskStatus)).toHaveText('draft',{ timeout: 30000 });
  await taskPage.createDeliverable(page);
  await taskPage.createProposal(page);
  await taskPage.disputeProposal(page);
  await wait(TWO_SECONDS);
  const proposalState = await page.getByTestId(locators.proposalPageLocator.proposalState).first().textContent();
  expect(proposalState?.toLowerCase()).toBe('failed');
  await governancePage.setDisputeTime(page);
});

test("should be able to cancel a task sucessfully", async () => {
  await registryPage.setCancelFee(page);
  await governancePage.setDraftTime(page, 120);
  await taskPage.createTask(page);
  await taskPage.cancelTask(page);
  await expect(page.getByTestId(locators.taskPageLocator.taskStatus)).toHaveText('canceled',{ timeout: 20000 });
  await governancePage.setDraftTime(page);
});

test("should be able to create a funding request sucessfully", async () => {
  test.setTimeout(600000);
  await taskPage.createFundingRequest(page);
  await taskPage.fundIt(page);
  await taskPage.createDeliverable(page);
  await taskPage.createProposal(page);
  await taskPage.acceptProposal(page);
  await expect(page.getByText(locators.elementText.textAccepted).first()).toBeVisible({ timeout: 20000 });

});

test("should be able to create a funding request with reward sucessfully", async () => {
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

test('should be able to create a marketplace sucessfully', async () => {
  await switchAccountAndConnect(page, environment.WALLET_ADDRESS);
  await marketplacePage.createMarketplace(page);
  await expect(page.getByTestId(locators.marketplacePageLocator.btnCreateOne)).toBeVisible({ timeout: MINUTE });
});

test('should be able to close a marketplace sucessfully', async () => {
  await switchAccountAndConnect(page, environment.WALLET_ADDRESS);
  await marketplacePage.closeMarketplace(page);
  await expect(page.getByText(locators.elementText.toastySuccess)).toBeVisible({ timeout: 30000 });
});

test('should lock voting succesfully', async () => {
  const lockAmount = 1000;
  await openSettingsPage(page, locators.commonPageLocator.btnVotingPowerProfileMenu);
  const { previousAmount, currentAmount } = await votingPowerPage.lockVotes(page, lockAmount);
  await expect(currentAmount).toBe(previousAmount - lockAmount);
});

test('should unlock votes successfully', async () => {
  const unlockAmount = 1000;
  await openSettingsPage(page, locators.commonPageLocator.btnVotingPowerProfileMenu);
  const { previousAmount, currentAmount } = await votingPowerPage.unlockVotes(page, unlockAmount);
  await expect(currentAmount).toBe(previousAmount - unlockAmount);
});

test('should delegate votes successfully', async () => {
  const delegateAmount = 5;
  await openSettingsPage(page, locators.commonPageLocator.btnVotingPowerProfileMenu);
  await votingPowerPage.delegateVotes(page, delegateAmount);
  expect(await page.locator(`[data-testid='delegation-${environment.WALLET_ADDRESS}-${delegateAmount}']`).count())
    .toBeGreaterThanOrEqual(1);
});

test('should change curator amount and still be a curator', async () => {
  await governancePage.setCuratorAmount(page, 50);
  await page.getByTestId(locators.commonPageLocator.btnVotingPowerProfileMenu).first().click();
  await votingPowerPage.lockVotes(page, 100);
  await page.getByTestId(locators.commonPageLocator.btnCustomMarketplaceProfileMenu).first().click();
  await governancePage.setCuratorAmount(page, 80);
  await votingPowerPage.checkCuratorStatus(page);
});

test('should change Governor options successfully', async () => {
  await governancePage.setDisputeTime(page, await getRandomInt(60, 1728000));
  await governancePage.setPercentageForDispute(page, await getRandomFloat(1, 51));
  await governancePage.setDraftTime(page, await getRandomInt(60, 1728000));
  await governancePage.setCuratorAmount(page, await getRandomInt(1, 10000));
  await governancePage.setMergerFee(page, await getRandomFloat(0, 10));
  await governancePage.setProposalCreatorFee(page, await getRandomFloat(0, 10));
});

test('should change registry options successfully', async () => {
  await registryPage.setCancelFee(page, await getRandomFloat(0, 100));
  await registryPage.setCloseFee(page, await getRandomFloat(0, 90));
  await registryPage.setMarketplaceCreationFee(page, await getRandomFloat(0, 99));
  await registryPage.setMarketplaceCreationAmount(page, await getRandomInt(0, 50000));
});