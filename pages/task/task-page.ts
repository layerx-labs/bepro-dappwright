import Locators from "pages/locators";
import { Page, expect } from "@playwright/test";
import { openMenuToCreate, getRandomInt, wait, customApprove, customConfirmTransaction } from "tests/single-test/custom-helper";
import { faker } from '@faker-js/faker';

export default class TaskPage extends Locators {
    link = 'https://afrodite.bepro.network';

    createTaskTitle() {
        const task = faker.lorem.words(5);
        return task.toString();
    }
    createTaskDescription() {
        const description = faker.lorem.paragraphs(2, '<br/>\n');
        return description.toString();
    }

    createTaskValue() {
        const value = faker.number.int({ max: 1000 })
        return value;
    }

    async selectMarketplace(page: Page) {
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
        const taskOptions = [this.taskPageLocator.btnDesignCreateTask, this.taskPageLocator.btnOtherCreateTask, this.taskPageLocator.btnCodeCreateTask];
        await page.getByTestId(taskOptions[await getRandomInt(0, 2)]).click();
        await page.getByTestId(this.taskPageLocator.btnNextCreateTask).click();
    }

    async createTask(page: Page) {
        await this.fillTaskFirstPage(page);
        await this.fillTaskValue(page);
        await page.getByTestId(this.taskPageLocator.btnNextCreateTask).click();
        await page.getByTestId(this.taskPageLocator.btnApproveCreateTask).click();
        await customApprove(page);
        await page.getByTestId(this.taskPageLocator.btnCreateTask).click({ timeout: 50000 });
        await customConfirmTransaction(page);
    }

    async changeTaskTags(page: Page) {
        await page.getByTestId(this.taskPageLocator.taskStatus).isVisible();
        await wait(5000);
        await page.getByTestId(this.taskPageLocator.btnTaskEdit).click();
        await wait(1000);
        await page.locator(this.taskPageLocator.reactInputDropdownEditTags).click();
        await this.getRandomTag(page);
        await wait(1000);
        await page.getByText(this.elementText.btnSaveChanges).click();
    }

    async getRandomTag(page: Page) {
        const tags = await page.$$(".react-select__option");
        const randomIndex = await getRandomInt(0, tags.length - 1);
        await tags[randomIndex]?.click();
    }

    async changeTaskValue(page: Page) {
        await page.getByTestId(this.taskPageLocator.btnTaskUpdateAmount).click();
        await wait(2500);
        await page.getByTestId(this.taskPageLocator.inputSetReward).clear();
        await page.getByTestId(this.taskPageLocator.inputSetReward).fill('1001');
        await page.getByTestId(this.taskPageLocator.btnTaskUpdateAmountApprove).click();
        await customApprove(page);
        await page.getByTestId(this.taskPageLocator.btnTaskUpdateAmountConfirm).click();
        await customConfirmTransaction(page);
    }

    async createFundingRequest(page: Page) {
        await this.fillTaskFirstPage(page);
        await page.getByTestId(this.taskPageLocator.btnSeekFundingCreateTask).click();
        const value = this.createTaskValue();
        await page.getByTestId(this.taskPageLocator.inputTotalAmmount).fill(`${value}`);

        await page.getByTestId(this.taskPageLocator.btnNextCreateTask).click();
        await wait(1000);
        await page.getByTestId(this.taskPageLocator.btnCreateTask).click();
        await customConfirmTransaction(page);
    }

    async fundIt(page: Page){
        await wait(2000);
        await page.getByText('Fund Task').click();
        await wait(1000);
        await page.locator('span.input-group-text').click();
        await page.getByText('Approve').click();
        await customApprove(page);
        await wait(4000); 
        await page.locator('button.btn.btn-primary span').last().click();
        await customConfirmTransaction(page);
    }

    async createFundingRequestWithReward(page: Page) {
        await this.fillTaskFirstPage(page);
        await page.getByTestId(this.taskPageLocator.btnSeekFundingCreateTask).click();

        const value = this.createTaskValue();
        await page.getByTestId(this.taskPageLocator.inputTotalAmmount).fill(`${value}`);
        await page.getByTestId(this.taskPageLocator.switchSetFundersReward).click();
        await page.getByTestId(this.taskPageLocator.inputFundersReward).fill(`${value}`);
        await page.getByTestId(this.taskPageLocator.btnNextCreateTask).click();
        await page.getByTestId(this.taskPageLocator.btnApproveCreateTask).click();

        await customApprove(page);
        await page.getByTestId(this.taskPageLocator.btnCreateTask).click();
        await customConfirmTransaction(page);
    }

    async changeTaskDescription(page: Page) {
        await wait(1000);
        await page.getByTestId(this.taskPageLocator.btnTaskEdit).click();
        await wait(1000);
        await page.getByTestId(this.commonPageLocator.textareaDescriptionCreateTaskDeliverableOrMarketplace).fill('');
        await page.getByTestId(this.commonPageLocator.textareaDescriptionCreateTaskDeliverableOrMarketplace).fill('Description automaticaly changed for testing purposes');
        await wait(1000);
        await page.getByText('Save Changes').click();
        await expect(page.getByText(this.elementText.toastySuccess)).toBeVisible({ timeout: 20000 });
    }
    async cancelTask(page: Page) {
        await expect(page.getByTestId(this.taskPageLocator.taskStatus)).toBeVisible({ timeout: 20000 });
        await page.reload()
        await wait(4000);
        await page.getByTestId(this.taskPageLocator.btnTaskOptions).click();
        await wait(1000);
        await page.getByTestId(this.taskPageLocator.btnTaskCancel).click();
        await customConfirmTransaction(page);
    }

    async waitTaskChangeStatusToOpen(page: Page) {
        await wait(10000);
        let status = await page.getByTestId(this.taskPageLocator.taskStatus).innerText();
        if (status === 'Draft' || status === 'Funding') {
            await page.reload();
            await this.waitTaskChangeStatusToOpen(page);
        } else {
        }
    }

    async createDeliverable(page: Page) {
        await this.waitTaskChangeStatusToOpen(page);
        await wait(2000);
        await page.getByTestId(this.taskPageLocator.btnTaskStartWorking).click();
        await wait(1000);
        await page.getByTestId(this.taskPageLocator.btnTaskCreateDeliverable).click();
        await wait(1000);

        await page.getByTestId(this.taskPageLocator.inputOriginLinkCreateTaskOrDeliverable).fill(this.link);
        await page.getByTestId(this.taskPageLocator.inputTitleCreateTaskOrDeliverable).fill(this.createTaskTitle());
        await page.getByTestId(this.commonPageLocator.textareaDescriptionCreateTaskDeliverableOrMarketplace).fill(this.createTaskDescription());
        await page.getByTestId(this.taskPageLocator.btnConfirmCreateDeliverable).click();

        await customConfirmTransaction(page);
        await page.getByTestId(this.taskPageLocator.btnMarkAsReady).click();

        await customConfirmTransaction(page);
        await page.getByTestId(this.taskPageLocator.btnArrowBackFromDeliverable).click();
    }

    async cancelDeliverable(page: Page) {
        await page.getByTestId('actions.review').click();
        await wait(1000);
        await page.locator('button.border').click();
        await wait(2000);
        await page.getByTestId('cancel').click();
        await customConfirmTransaction(page);
    }

    async createProposal(page: Page) {
        await page.getByTestId(this.taskPageLocator.btnCreateProposal).click();
        await page.locator(this.taskPageLocator.dropdownProposal).click();
        const option = await page.$(this.taskPageLocator.dropdownOptionProposal);
        await option?.click();
        await page.getByTestId(this.taskPageLocator.btnModalCreateProposal).click();
        await customConfirmTransaction(page);
    }

    async acceptProposal(page: Page) {
        await page.getByTestId(this.taskPageLocator.btnViewProposal).nth(1).click();
        await wait(4000);
        await this.checkProposalStatus(page);
        await wait(1000);
        await page.getByTestId(this.taskPageLocator.btnAcceptProposal).nth(1).click();
        await page.getByTestId(this.taskPageLocator.btnConfirmDistribution).click();
        await customConfirmTransaction(page);
    }

    async disputeProposal(page: Page) {
        await wait(4000);
        await page.getByTestId(this.taskPageLocator.btnViewProposal).nth(1).click();
        await page.getByTestId(this.taskPageLocator.btnDisputeProposal).click();
        await customConfirmTransaction(page);
    }
    async withdraw(page: Page){
        await wait(1000);
        await page.locator('button.align-items-center.not-svg > svg').click();
        await wait(1000);
        
        await page.locator('button.btn.btn-primary span.family-Regular.caption-medium.text-white.font-weight-normal').click();
        await wait(1000);
        await page.getByText('Withdraw Reward').click();
        await wait(1000);
        await page.locator('div.modal div.align-items-center span').click();
        await customConfirmTransaction(page);
    }

    async checkProposalStatus(page: Page) {
        await page.reload();
        await wait(10000);
        if (!await page.getByTestId(this.taskPageLocator.btnAcceptProposal).last().isVisible()) {
            await this.checkProposalStatus(page);
        }
    }

}