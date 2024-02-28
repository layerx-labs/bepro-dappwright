import { BrowserContext, test as baseTest } from "@playwright/test";
import dappwright, { Dappwright, CoinbaseWallet } from "@tenkeylabs/dappwright";

import { environment } from "../../network-config";
import { importPK } from "./coinbase/custom-actions";

export function withCoinbaseTest() {
  return baseTest.extend<{
    context: BrowserContext;
    wallet: Dappwright;
  }>({
    context: async ({ }, use) => {
      const [wallet, page, context] = await dappwright.bootstrap("", {
        wallet: "coinbase",
        version: CoinbaseWallet.recommendedVersion,
        headless: false,
      });

      const hasNetwork  = await wallet.hasNetwork(environment.NETWORK_NAME);
  
      if (!hasNetwork)
        await wallet.addNetwork({
          networkName: environment.NETWORK_NAME,
          rpc: environment.RPC,
          chainId: environment.CHAIN_ID,
          symbol: environment.SYMBOL
        });
      else
        await wallet.switchNetwork(environment.NETWORK_NAME);

      await importPK(environment.PRIVATE_KEY, page, wallet);
      // await wallet.importPK(environment.PRIVATE_KEY);

      await use(context);
    },

    wallet: async ({ context }, use) => {
      const metamask = await dappwright.getWallet("coinbase", context);
  
      await use(metamask);
    },
  });
}