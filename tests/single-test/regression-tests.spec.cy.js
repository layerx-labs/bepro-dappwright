import MarketplacePage from "../pages/marketplace/marketplace-page";
import TaskPage from "../pages/task/task-page";
import Locators from "../pages/locators";
import { RegistryPage, GovernancePage, VotingPowerPage } from "../pages/profile";
const registryPage = new RegistryPage();
const governancePage = new GovernancePage();
const locators = new Locators();
const marketplacePage = new MarketplacePage();
const taskPage = new TaskPage();
const votingPowerPage = new VotingPowerPage();

describe("Do regression tests in the app spec", () => {
    before(() => {
        cy.visit('');
        cy.get(locators.commonPageLocator.btnAcceptCookies).click();
        cy.connectWalletFirstTime();
        cy.openSettingsPage(locators.commonPageLocator.btnCustomMarketplaceProfileMenu);
        governancePage.setDisputeTime();
        governancePage.setDraftTime();
        registryPage.setCancelFee();
        cy.visit('');
        cy.wait(1000);
    });

    it("should create and finish a task successfully", () => {
        taskPage.createTask();
        cy.get(locators.taskPageLocator.textTaskStatus).should('be.visible');
        taskPage.createDeliverable();
        cy.contains('Marked deliverable as ready.').should('be.visible');
        taskPage.createProposal();
        taskPage.acceptProposal();
        cy.contains(locators.elementText.textAccepted).should('be.visible');
    });

    it("should change task's description successfully", () => {
        taskPage.createTask();
        cy.get(locators.taskPageLocator.textTaskStatus).should('be.visible');
        taskPage.changeTaskDescription();
    });

    it("should change task's and tags value successfully", () => {
        taskPage.createTask();
        cy.get(locators.taskPageLocator.textTaskStatus).should('be.visible');
        taskPage.changeTaskTags();
        cy.contains(locators.elementText.toastySuccess).should('be.visible');
        taskPage.changeTaskValue();
        cy.get(locators.taskPageLocator.textTaskValue).invoke('text').should('be.eq', '1,001.00000');
        cy.contains(locators.elementText.toastySuccess).should('be.visible');
    });

    it("should Cancel task successfully", () => {
        taskPage.createTask();
        cy.get(locators.taskPageLocator.textTaskStatus).should('be.visible');
        taskPage.cancelTask();
        cy.get(locators.taskPageLocator.textTaskStatus).should('be.eq', 'canceled');
    });

    it("should create a Funding Request task without Reward successfully", () => {
        taskPage.createFundingRequest();
        cy.get(locators.taskPageLocator.textTaskStatus).should('be.visible').invoke('text').should('be.eq', 'funding');
    });

    it("should create a Funding Request task with Reward task successfully", () => {
        taskPage.createFundingRequestWithReward();
        cy.get(locators.taskPageLocator.textTaskStatus).should('be.visible').invoke('text').should('be.eq', 'funding');
    });

    it("should create new Marketplace successfully", () => {
        cy.switchAccountAndConnect(3);
        marketplacePage.createMarketplace();
        cy.get(locators.marketplacePageLocator.btnCreateOne).should('be.visible');

    });

    it("should close new Marketplace successfully", () => {
        // cy.switchAccountAndConnect(3);
        marketplacePage.closeMarketplace();
        cy.contains(locators.elementText.textConfirmationMarketplaceClosed).should('be.visible');
    });

    it("should lock token value successfully", () => {
        cy.openSettingsPage(locators.commonPageLocator.btnVotingPowerProfileMenu);
        votingPowerPage.selectMarketplaceAndNetwork('bepro', 'Mumbai');
        votingPowerPage.lockVotes(1000);
        cy.contains('sucess').should('be.visible');
    });

    it("should unlock token value successfully", () => {
        cy.openSettingsPage(locators.commonPageLocator.btnVotingPowerProfileMenu);
        votingPowerPage.selectMarketplaceAndNetwork('bepro', 'Mumbai');
        votingPowerPage.unlockVotes(1000);
        cy.contains('sucess').should('be.visible');
    });

    it("should change Governor options successfully", () => {
        cy.openSettingsPage(locators.commonPageLocator.btnCustomMarketplaceProfileMenu);
        cy.getRandomInt(60, 1728000).then((randomNumber) => {
            governancePage.setDisputeTime(randomNumber);
        })
        cy.getRandomFloat(1, 51).then((randomNumber) => {
            governancePage.setPercentageForDispute(randomNumber);

        })
        cy.getRandomInt(60, 1728000).then((randomNumber) => {
            governancePage.setDraftTime(randomNumber);

        })
        cy.getRandomInt(1, 10000).then((randomNumber) => {
            governancePage.setCuratorAmount(randomNumber);

        })
        cy.getRandomFloat(0, 10).then((randomNumber) => {
            governancePage.setMergerFee(randomNumber);

        })
        cy.getRandomFloat(0, 10).then((randomNumber) => {
            governancePage.setProposalCreatorFee(randomNumber);

        })

    });

    it("should change registry options successfully", () => {
        cy.openSettingsPage(locators.commonPageLocator.btnCustomMarketplaceProfileMenu);
        cy.getRandomFloat(0, 100).then((randomNumber) => {
            registryPage.setCancelFee(randomNumber);
        })
        cy.getRandomFloat(0, 90).then((randomNumber) => {
            registryPage.setCloseFee(randomNumber);

        })
        cy.getRandomFloat(0, 99).then((randomNumber) => {
            registryPage.setMarketplaceCreationFee(randomNumber);

        })
        cy.getRandomInt(0, 50000).then((randomNumber) => {
            registryPage.setMarketplaceCreationAmount(randomNumber);

        })
    });


});