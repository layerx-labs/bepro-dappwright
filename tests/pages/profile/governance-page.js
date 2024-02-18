import Locators from "../locators";

export default class GovernancePage extends Locators {


    setGovernorSettings(tab, configToChange, valueToChange, saveButton) {
        cy.waitForResources();
        cy.get(tab).click();
        cy.get(configToChange).then((input) => {
            this.tryToChangeParameters(input, valueToChange, saveButton);
        });
    }

    tryToChangeParameters(input, valueToChange, saveButton) {
        if (input.val == 0) {
            cy.waitForResources();
        } else if (input.val() == valueToChange) {
            cy.log('No need to change the value');
            cy.get(this.managementPageLocator.tabLogoAndColors).click({ force: true });
            return;
        }
        cy.wrap(input).clear().type(valueToChange);
        cy.contains(this.commonPageLocator.btn, saveButton).should('be.enabled').click({ force: true });
        cy.waitForResources();
        cy.confirmMetamaskPermissionToSpend();
        cy.contains(this.elementText.toastySuccess).should('be.visible');
        cy.reload();
    }

    setDisputeTime(disputeTime = 60) {
        this.setGovernorSettings(this.managementPageLocator.tabGovernance, this.managementPageLocator.inputDisputeTime, disputeTime, this.elementText.btnSaveChanges);
    }

    setPercentageForDispute(percentageForDispute = 3) {
        this.setGovernorSettings(this.managementPageLocator.tabGovernance, this.managementPageLocator.inputPercentageForDispute, percentageForDispute, this.elementText.btnSaveChanges);
    }

    setDraftTime(draftTime = 60) {
        this.setGovernorSettings(this.managementPageLocator.tabGovernance, this.managementPageLocator.inputDraftTime, draftTime, this.elementText.btnSaveChanges);
    }

    setCuratorAmount(curatorAmount = 10000) {
        this.setGovernorSettings(this.managementPageLocator.tabGovernance, this.managementPageLocator.inputCuratorAmount, curatorAmount, this.elementText.btnSaveChanges);
    }

    setMergerFee(mergerFee = 0.05) {
        this.setGovernorSettings(this.managementPageLocator.tabGovernance, this.managementPageLocator.inputMergerFee, mergerFee, this.elementText.btnSaveChanges);
    }

    setProposalCreatorFee(proposalCreatorFee = 2) {
        this.setGovernorSettings(this.managementPageLocator.tabGovernance, this.managementPageLocator.inputProposalCreatorFee, proposalCreatorFee, this.elementText.btnSaveChanges);
    }

}