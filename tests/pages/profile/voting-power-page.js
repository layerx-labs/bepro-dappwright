import Locators from "../locators";
const { faker } = require('@faker-js/faker');

export default class VotingPowerPage extends Locators {

    selectMarketplaceAndNetwork(marketplaceName = 'bepro', networkName = 'Mumbai') {
        cy.get(this.managementPageLocator.inputSelectMarketplace).click({ force: true });
        cy.get(this.commonPageLocator.classOptionDropdown).contains(marketplaceName).click({ force: true });
        cy.get(this.managementPageLocator.inputSelectNetwork).click({ force: true });
        cy.get(this.commonPageLocator.classOptionDropdown).contains(networkName).click({ force: true });
    }
    

    lockVotes(votes = 2) {
        cy.waitForResources();
        cy.get(this.managementPageLocator.inputBeproAmountToLock).type(votes);
        cy.get(this.commonPageLocator.btnApproveLock).should('be.enabled').click();
        cy.waitForResources();
        cy.confirmMetamaskPermissionToSpend();

        cy.get(this.managementPageLocator.btnGetVotes).should('be.enabled').click();
        cy.get(this.managementPageLocator.modalConfirmGetVotes).should('be.enabled').click();
        cy.waitForResources();
        cy.confirmMetamaskPermissionToSpend();

    }

    unlockVotes(votes = 2) {
        cy.get(this.managementPageLocator.tabUnlock).click();
        cy.waitForResources();
        cy.get(this.managementPageLocator.inputBeproVotesAmountToUnlock).type(votes);
        cy.get(this.managementPageLocator.btnGetVotes).should('be.enabled').click();
        cy.get(this.managementPageLocator.modalConfirmGetVotes).should('be.enabled').click();
        cy.waitForResources();
        cy.confirmMetamaskPermissionToSpend();
    }

}