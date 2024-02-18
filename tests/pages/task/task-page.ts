import Locators from "../locators";
import { Page, expect } from "@playwright/test";
import { openMenuToCreate, getRandomInt, getRandomFloat, customApprove, customConfirmTransaction } from "../../single-test/custom-helper"
import { Dappwright } from "@tenkeylabs/dappwright";
import { faker } from '@faker-js/faker';
export default class TaskPage extends Locators {
    link = 'https://afrodite.bepro.network';

    createTaskTitle() {
        const task = faker.lorem.words(5);
        return task.toString();
    }
    //this method will be replaced for cy.createDescription()
    createTaskDescription() {
        const description = faker.lorem.paragraphs(2, '<br/>\n');
        return description.toString();
    }

    createTaskValue() {
        const value = faker.number.int({ max: 1000 })
        return value;
    }

    async selectMarketplace(page: Page) {
        // Clica no item com texto "bepro" dentro do dropdown
        await page.getByText(this.elementText.btnBepro).click();
        await page.getByTestId(this.taskPageLocator.btnNextCreateTask).click();
    }

    async fillTaskTitle(page: Page) {
        const title = this.createTaskTitle();
        await page.getByTestId(this.taskPageLocator.inputTitleCreateTaskOrDeliverable).fill(title);
    }

    async fillTaskDescription(page: Page) {
        const description = this.createTaskDescription();
        await page.getByTestId(this.commonPageLocator.textareaDescriptionCreateTaskDeliverableOrMarketplace).fill(description);
    }

    async insertTag(page: Page) {
        await page.locator(this.commonPageLocator.inputTags).click();
        await this.getRandomTag(page);
    }

    async fillTaskValue(page: Page) {
        const value = this.createTaskValue();
        await page.getByTestId(this.taskPageLocator.inputTotalAmmount).fill(`${value}`);
    }

    async fillTaskFirstPage(page: Page) {
        await openMenuToCreate(page, this.commonPageLocator.btnLaunchInOpenMarketplace);
        await page.getByTestId(this.taskPageLocator.btnNextCreateTask).click();
        
        await this.fillTaskTitle(page);
        await this.fillTaskDescription(page);
        await this.insertTag(page);
        const taskOptions = [this.taskPageLocator.btnDesignCreateTask,this.taskPageLocator.btnOtherCreateTask, this.taskPageLocator.btnCodeCreateTask];
        await page.getByTestId(taskOptions[await getRandomInt(0, 2)]).click();
        await page.getByTestId(this.taskPageLocator.btnNextCreateTask).click();
    }

    async createTask(page: Page) {
        await this.fillTaskFirstPage(page);
        await this.fillTaskValue(page);
        await page.getByTestId(this.taskPageLocator.btnNextCreateTask).click();
        await page.getByTestId(this.taskPageLocator.btnApproveCreateTask).click();

        await customApprove(page);
        await page.getByTestId(this.taskPageLocator.btnCreateTask).click({timeout: 200000});
        await customConfirmTransaction(page);
    }

    async changeTaskTags(page: Page) {
        await page.getByTestId(this.taskPageLocator.btnTaskEdit).click();
        await page.locator(this.taskPageLocator.reactInputDropdownEditTags).click();
        await this.getRandomTag(page);
        await page.getByText(this.elementText.btnSaveChanges).click();

    }

    async getRandomTag(page: Page) {
        const tags = await page.$$(".react-select__option");
        const randomIndex = await getRandomInt(0, tags.length - 1);
        await tags[randomIndex]?.click();
    }

    async changeTaskValue(page: Page) {
        await page.getByTestId(this.taskPageLocator.btnTaskUpdateAmount).click();
        await new Promise (resolve => setTimeout(resolve, 2000));
        await page.getByTestId(this.taskPageLocator.inputSetReward).clear();
        await page.getByTestId(this.taskPageLocator.inputSetReward).fill('1001');
        await page.getByTestId(this.taskPageLocator.btnTaskUpdateAmountApprove).click();

        await customApprove(page);
        await page.getByTestId(this.taskPageLocator.btnTaskUpdateAmountConfirm).click();
        await customConfirmTransaction(page);
    }

    async createFundingRequest(page: Page) {
        this.fillTaskFirstPage(page);
        await page.click(this.taskPageLocator.btnSeekFundingCreateTask);
        const value = this.createTaskValue();
        await page.fill(this.taskPageLocator.inputTotalAmmount, `${value}`);

        await page.click(this.taskPageLocator.btnNextCreateTask);
        await page.click(this.taskPageLocator.btnCreateTask);
        await customConfirmTransaction(page);
    }

    async createFundingRequestWithReward(page: Page) {
        await this.fillTaskFirstPage(page);
        await page.click(this.taskPageLocator.btnSeekFundingCreateTask);

        const value = this.createTaskValue();
        await page.fill(this.taskPageLocator.inputTotalAmmount, `${value}`);
        await page.click(this.taskPageLocator.switchSetFundersReward);
        await page.fill(this.taskPageLocator.inputFundersReward, `${value}`);
        await page.click(this.taskPageLocator.btnNextCreateTask);
        await page.click(this.taskPageLocator.btnApproveCreateTask);

        await customConfirmTransaction(page);
        await page.click(this.taskPageLocator.btnCreateTask);
        await customConfirmTransaction(page);
    }

    async changeTaskDescription(page: Page) {
        await page.getByTestId(this.taskPageLocator.btnTaskEdit).click();
        await page.fill(this.commonPageLocator.textareaDescriptionCreateTaskDeliverableOrMarketplace, '')
        await page.fill(this.commonPageLocator.textareaDescriptionCreateTaskDeliverableOrMarketplace, 'Description automaticaly changed for testing purposes');
        await page.getByText('Save Changes').click();
        page.getByText('Success');
    }
    async cancelTask(page: Page) {
        await page.click(this.taskPageLocator.btnTaskOptions);
        await page.click(this.taskPageLocator.btnTaskCancel);
        await customConfirmTransaction(page);
    }

    async waitTaskChangeStatusToOpen(page: Page) {
        await new Promise (resolve => setTimeout(resolve, 45000));
        await page.reload();
    }

    async createDeliverable(page: Page) {
        await this.waitTaskChangeStatusToOpen(page);
        //     // Encontre o botão pelo seu texto
        //     cy.get(this.commonPageLocator.btn).invoke('text').then(($buttonText) => {
        //         cy.log($buttonText);
        //         if ($buttonText.includes(this.elementText.btnStartWorking)) {
        //             // O botão "Start Working" está presente, clique nele
        //             cy.contains(this.elementText.btnStartWorking).should('be.enabled').click({ force: true });

        //             // Agora, clique no botão "Create Deliverable"
        //             cy.contains(this.elementText.btnCreateDeliverable).should('be.enabled').click({ force: true });
        //         } else {
        //             // O botão "Start Working" não está presente, clique diretamente no botão "Create Deliverable"
        //             cy.log('Start Working button not present, clicking Create Deliverable directly');
        //             cy.contains(this.elementText.btnCreateDeliverable).should('be.enabled').click({ force: true });
        //         }
        //     });

        //     cy.get(this.taskPageLocator.inputOriginLinkCreateTaskOrDeliverable).fill(this.link, { force: true });
        //     cy.get(this.taskPageLocator.imgPreviewLinkDeliverable).should('be.visible');
        //     cy.get(this.taskPageLocator.inputTitleCreateTaskOrDeliverable).fill(this.createTaskTitle(), { force: true });
        //     cy.get(this.commonPageLocator.textareaDescriptionCreateTaskDeliverableOrMarketplace).fill(this.createTaskDescription(), { force: true });
        //     cy.get(this.taskPageLocator.btnConfirmCreateDeliverable).should('be.enabled').click();

        //     cy.confirmMetamaskTransaction();
        //     cy.get(this.taskPageLocator.btnMarkAsReady).wait(1000).click();

        //     cy.confirmMetamaskTransaction();
        //     cy.get(this.taskPageLocator.btnArrowBackFromDeliverable).click({ force: true });
        // }

        // async createProposal() {
        //     cy.get(this.taskPageLocator.btnCreateProposal).click({ force: true });
        //     cy.contains(this.taskPageLocator.dropdownProposal, this.taskPageLocator.placeholderProposal).click({ force: true });
        //     cy.get(this.taskPageLocator.dropdownOptionProposal).first().click({ force: true });
        //     cy.get(this.taskPageLocator.btnModalCreateProposal).click({ force: true });

        //     cy.confirmMetamaskTransaction();
        // Encontre o botão pelo seu texto
        const buttonText = await page.$eval(this.commonPageLocator.btn, button => button.textContent) || 'nothing';
        console.log(buttonText);

        if (buttonText.includes(this.elementText.btnStartWorking)) {
            // O botão "Start Working" está presente, clique nele
            const startWorkingButton = page.getByText(this.elementText.btnStartWorking);
            if (startWorkingButton) {
                await startWorkingButton.click();
            }

            // Agora, clique no botão "Create Deliverable"
            const createDeliverableButton = page.getByText(this.elementText.btnCreateDeliverable);
            if (createDeliverableButton) {
                await createDeliverableButton.click();
            }
        } else {
            // O botão "Start Working" não está presente, clique diretamente no botão "Create Deliverable"
            console.log('Start Working button not present, clicking Create Deliverable directly');
            const createDeliverableButton = page.getByText(this.elementText.btnCreateDeliverable);
            if (createDeliverableButton) {
                await createDeliverableButton.click();
            }
        }

        await page.fill(this.taskPageLocator.inputOriginLinkCreateTaskOrDeliverable, this.link);
        await page.waitForSelector(this.taskPageLocator.imgPreviewLinkDeliverable);
        await page.fill(this.taskPageLocator.inputTitleCreateTaskOrDeliverable, this.createTaskTitle());
        await page.fill(this.commonPageLocator.textareaDescriptionCreateTaskDeliverableOrMarketplace, this.createTaskDescription());
        await page.click(this.taskPageLocator.btnConfirmCreateDeliverable);

        await customConfirmTransaction(page);
        await page.click(this.taskPageLocator.btnMarkAsReady);

        await customConfirmTransaction(page);
        await page.click(this.taskPageLocator.btnArrowBackFromDeliverable);
    }

    async acceptProposal(page: Page) {
        await page.$(this.taskPageLocator.btnViewProposal);
        // await page.waitForSelector(this.taskPageLocator.componentProposalstatus);

        // await page.waitForFunction((elementText, btnAcceptProposalSelector) => {
        //     const text = document.querySelector(elementText).textContent;
        //     return text.includes('Accept Proposal');
        // }, {}, this.taskPageLocator.componentProposalstatus, this.elementText.btnAcceptProposal);

        // await page.click(this.taskPageLocator.btnAcceptProposal);
        // await page.waitForSelector(this.taskPageLocator.btnConfirmDistribution);
        // await page.click(this.taskPageLocator.btnConfirmDistribution);

        await customConfirmTransaction(page);

    }

}