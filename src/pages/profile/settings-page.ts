import Locators from "src/pages/locators";
import { Page } from "@playwright/test";
import { faker } from '@faker-js/faker';

export default class SettingsPage extends Locators {

    async changeName(page: Page){
        await page.getByTestId(this.managementPageLocator.btnChangeProfileHandle).click();
        await page.getByTestId(this.managementPageLocator.inputChangeProfileHandle).fill('');
        await page.getByTestId(this.managementPageLocator.inputChangeProfileHandle).fill(faker.lorem.slug({ min: 2, max: 4 }));
        await page.getByTestId(this.managementPageLocator.btnSaveProfileHandle).click();
    }


}