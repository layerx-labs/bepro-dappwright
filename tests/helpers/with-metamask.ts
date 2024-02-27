import { BrowserContext, test as baseTest } from "@playwright/test";
import dappwright, { Dappwright, MetaMaskWallet } from "@tenkeylabs/dappwright";

import { environment } from "../../network-config";

export function withMetaMaskTest() {
  return baseTest.extend<{
    context: BrowserContext;
    wallet: Dappwright;
  }>({
    context: async ({ }, use) => {
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
}