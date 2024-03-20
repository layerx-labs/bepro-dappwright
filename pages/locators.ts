export default class Locators {

    commonPageLocator = {
        btnCreateOne: 'btnCreateOne',
        btnConnectWallet: "[data-testid='connect-wallet-button']",
        btnCreate: "create-marketplace-options-button",
        profileIcon: "avatar-or-identicon",
        btnSettings: "Settings",
        btnWalletProfileMenu: "Wallet",
        btnVotingPowerProfileMenu: "Voting Power",
        btnPaymentsProfileMenu: "Payments",
        btnTasksProfileMenu: "Tasks",
        btnDeliverablesProfileMenu: "Deliverables",
        btnProposalsProfileMenu: "Proposals",
        btnCustomMarketplaceProfileMenu: "Custom Marketplace",
        btnDisconnectWallet: "disconnect-wallet-btn",
        btnLaunchInOpenMarketplace: 'Launch in Open Marketplace',
        btnGetExpertHelp: "Get Expert Help",
        btnCreateYourMarketplace: "Create Your Marketplace",
        btnContinueCreation: 'Continue',
        btnCancelCreation: "Cancel",
        btnNotifications: "notifications-btn",
        btnMarketPlaces: "marketplaces",
        beproMarketPlace: "bepro",
        btnCurators: "curators",
        btn: 'button',
        btnAcceptCookies: "#rcc-confirm-button",
        btnApproveLock: "approve-btn",
        textareaDescriptionCreateTaskDeliverableOrMarketplace: 'description-textarea',
        classOptionDropdown:'.react-select__option',
        inputTags: '.react-select-container',
        //rever esses de baixo
        inputMarketPlaceSelect: "#root-container > div.d-none.d-md-flex.flex-column > div:nth-child(1) > div > div > div.d-none.d-md-flex.mx-2.flex-column.bg-gray-900.p-4.border-radius-4.border.border-gray-850 > div > div > div.select-network-dropdown.w-max-none > div > div",
        beproMarketSelect: ".react-select__option",
    };

    taskPageLocator = {
        //tasks
        linkCreateFirstTask: "[data-testid='first-task-link']",
        inputSelectNetwork:"#react-select-9-input",
        listItemMaticumNetwork: '#react-select-9-listbox',
        inputSelectMarketplace:"#react-select-10-input",
        listItemBeproMarketplace:"#react-select-10-option-0",
        btnNextCreateTask: "create-task-next-button",
        btnBackCreateTask: "[data-testid='create-task-back-button']",
        inputTitleCreateTaskOrDeliverable: 'title-input',
        checkboxKycCreateTask: "[data-testid='checkbox-kyc']",
        btnCodeCreateTask: 'Code',
        btnDesignCreateTask: 'Design',
        btnOtherCreateTask: 'Other',
        inputOriginLinkCreateTaskOrDeliverable: "origin-link-input",
        btnSelfFundingCreateTask: "[data-testid='self-fund-btn']",
        btnSeekFundingCreateTask: "seek-funding-btn",
        textTotalBalance: "[data-testid='total-balance']",
        switchSetFundersReward: "form-check-reward-funders",
        inputFundersReward:"funders-reward-input",
        inputSetReward: 'reward-input',
        inputServiceFees: "[data-testid='service-fee-input']",
        inputTotalAmmount: 'total-amount-input',
        btnApproveCreateTask: 'create-task-approve-button',
        btnCreateTask: 'create-task-button',
        btnTaskOptions: "task-options",
        btnTaskCancel: "cancel-btn",
        btnTaskUpdateAmount: 'update-amount-btn',
        btnTaskUpdateAmountApprove: 'update-amount-modal-approve-btn',
        btnTaskUpdateAmountConfirm: 'update-amount-modal-confirm-btn',
        btnTaskEdit: 'edit-bounty-btn',
        reactInputDropdownEditTags: '.react-select__input-container',
        taskStatus: 'task-status',
        textTaskValue: "span.text-white.caption-large.font-weight-normal",
        textareaTaskComments: "[data-testid='comments-textarea']",
        btnTaskComment: "[data-testid='comments-btn']",
        btnTaskStartWorking: "start-working-btn",
        btnTaskCreateDeliverable: "deliverable-btn",
        imgPreviewLinkDeliverable: "image-preview",
        btnMarkAsReady: "Mark as ready",
        btnCancelCreateDeliverable: '[data-testid="cancel"]',
        btnReviewCreateDeliverable: '[data-testid="review"]',
        btnConfirmCreateDeliverable: "create-deliverable-btn",
        btnArrowBackFromDeliverable: "deliverable-back",
        btnCreateProposal: "proposal-btn",
        btnModalProposalCancel: '[data-testid="modal-proposal-cancel-btn"]',
        btnModalCreateProposal: "modal-proposal-create-btn",
        btnViewProposal: "actions.view-proposal",
        btnAcceptProposal: "proposal-accept-btn",
        btnRefuseProposal: '[data-testid="refuse-btn"]',
        btnCancelProposalModal: '[data-testid="modal-proposal-cancel-btn"]',
        btnConfirmDistribution: "modal-proposal-merge-btn",
        btnDisputeProposal: "dispute-btn",
        btnCancelUpdateTask: '[data-testid="update-amount-modal-cancel-btn"]',
        btnConfirmUpdateTask: '[data-testid="update-amount-modal-confirm-btn"]',
        textStatusProposal: '#root-container > div.container-xl > div > div > div.mt-3.row.justify-content-between > div:nth-child(2) > div > div:nth-child(1) > div.row.mb-2.proposal-progress-bar.align-items-center > div:nth-child(1) > h4',
        dropdownProposal: '.react-select__placeholder',
        placeholderProposal: 'Select...',
        dropdownOptionProposal: '.react-select__option',
        componentProposalstatus: '#root-container > div.container-xl > div > div > div.mt-3.row.justify-content-between > div:nth-child(2) > div',
    }


    marketplacePageLocator = {
        dropdownNetwork: '#root-container > div > div > div > div > div > div > div > div:nth-child(1) > div.collapse.show > div.row.pt-2 > div > div > div > div > div.react-select__value-container.react-select__value-container--has-value.css-hlgwow > div',
        dropdownNetworkOptions: '#react-select-5-option-0 > div > span.text-overflow-ellipsis',
        btnSelectNetworkNextStep: "Select Network-next-step-btn",
        btnLockTBepro: "lock-btn",
        btnLockTBeproNextStep: "Lock TBEPRO-next-step-btn",
        logoIcon: "logoIcon",
        fullLogo: "fullLogo",
        inputMarketplaceName: "diplay-name-input",
        btnMarketplaceInformationNextStep: "Marketplace information-next-step-btn",
        inputDisputeTime: "Dispute time",
        inputDraftTime: "Draft time",
        inputCuratorAmount: "Curator Amount",
        btnMarketplaceSettingsNextStep: "Marketplace Settings-next-step-btn",
        btnCreateMarketplace: "Governance Token-next-step-btn",
        btnCreateOne: "create-one-btn",
        dropdownTransactionalTokens: '#root-container > div > div > div > div > div > div > div > div:nth-child(5) > div.collapse.show > div.row.pt-2 > div:nth-child(3) > div > div > div.react-select__indicators.css-1wy0on6',
        beproTransactionalTokens: "select-item-TBEPRO",
        dropdownRewardTokens: '#root-container > div > div > div > div > div > div > div > div:nth-child(5) > div.collapse.show > div.row.pt-2 > div:nth-child(4) > div > div > div.react-select__indicators.css-1wy0on6',
        beproRewardTokens: "select-item-TBEPRO",
    }

    managementPageLocator = {
        //profile page
        btnChangeProfileHandle:"user-edit-icon-btn",
        inputChangeProfileHandle: 'user-name-edit-input',
        btnSaveProfileHandle: 'user-name-save-button',
        btnCopyAddress: 'copy-button',
        checkboxNotification: "[data-testid='switch']",
        inputEmail: "[data-testid='email-input']",
        btnSaveEmail: "[data-testid='notification-save-btn']",
        inputSearchBarWalletTokens: "wallet-search-input",
        tabLock: "[data-testid='Lock']",
        tabUnlock: "Unlock",
        oraclesActionsMax: "oracles-actions-max-button",
        oraclesActionsLoadingBalance: "oracle-actions-loading-balance",
        inputSelectMarketplace: "Select Marketplace",
        inputSelectNetwork:"Select Network",
        inputBeproAmountToLock: "oracle-actions-input",
        btnGetVotes: "get-votes-btn",
        inputBeproVotesAmountToUnlock: "oracle-actions-input",
        btnGetVotesUnlock: "[data-testid='get-votes-btn']",
        modalConfirmGetVotes: "modal-oracle-confirm-btn",
        inputDelegateVotesAmount: "votes-amount-input",
        inputDelegateVotesAddress: "delegate-address-input",
        btnDelegateVotes: "Delegate",
        btnTakeBackVotes: "take-back-btn",
        tabLogoAndColors: "tab-Logo & Colors",
        tabGovernance: "tab-Governance",
        tabRegistry: "tab-Registry",
        tabManagement: "tab-Management",
        tabPermissions: "tab-Permissions",
        logoIcon: "logoIcon",
        fullLogo: "fullLogo",
        btnSaveChanges: "submit-btn",
        inputPrimaryColor:"primary",
        inputDisputeTime: "Dispute time",
        inputPercentageForDispute: "Percentage for dispute",
        inputDraftTime: "Draft time",
        inputCuratorAmount: "Curator Amount",
        inputCancelableTime: "Cancelable Time",
        inputOracleExchangeRate: "oracle-exchange-rate",
        inputMergerFee: "Merger Fee",
        inputProposalCreatorFee: "Proposal Creator Fee",
        btnCloseMarketplace: "close-network-btn",
        inputCancelFee: "cancel-fee-input",
        inputCloseFee: "close-fee-input",
        inputMarketplaceCreationFee: "creation-fee-input",
        inputMarketplaceCreationAmount: "creation-fee-amount-input",
        btnHideTask: "hide-btn",
        btnTaskLink: "arrow-up-right-gray-btn",
        inputSearchTask: "search-input",
        inputBannedDomains: "banned-word-input",
        btnAddBannedDomains: "permission-add-btn",
        inputTaskCreationAllowList: "open-task-input",
        btnAddTaskCreationAllowList: "open-task-btn",
        inputCloseTaskAllowList: "close-task-input",
        btnAddCloseTaskAllowList: "close-task-btn",
        toastySuccess: '#__next > div > div.toast-container > div > div.toast-header.border-bottom-0.bg-transparent.px-3 > strong:contains("Success")',
    
    }

    elementText = {
        btnBepro: 'bepro',
        btnStartWorking: 'Start Working',
        btnCreateDeliverable: 'Create Deliverable',
        btnViewProposal: 'View Proposal',
        btnAcceptProposal: 'Accept',
        textAccepted: 'Accepted',
        btnMax: 'Max',
        btnLock: 'Lock TBEPRO',
        btnNextStep: 'Next Step',
        btnUploadLogoIcon: 'logo icon',
        btnUploadFullLogo: 'upload full logo',
        placeholderMarketplaceName: 'Marketplace name',
        placeholderMarketplaceDescription: 'Type a description...',
        btnVotingPower: 'Voting Power',
        btnSaveChanges: 'Save Changes',
        btnCloseMarketplace: 'Close marketplace',
        textConfirmationMarketplaceClosed: "You don't have a custom marketplace created",
        btnAdd: 'Add',
        toastySuccess: 'Success',
        btnConnectMetamask: 'Metamask',
    }

    curatorsPageLocator = {
        inputSearchBar: "search-input",
        btnCuratorsList: "Curators List",
        btnReadyToPropose: "Ready to Propose",
        btnReadyToDispute: "Ready to Dispute",
        btnReacyToClose: "Ready to Close",
    }
    
    leaderboardPageLocator = {
        inputSearchbar: "search-input",
    }

    explorePageLocator = {
        btnExplore: "explore",
        btnTechnology: "category-button-code",
        btnCreative: "category-button-design",
        btnMarketing: "category-button-marketing",
        btnWriting: "category-button-writing",
    }

}
