import dappwright, { MetaMaskWallet } from "@tenkeylabs/dappwright";

import { environment } from "network-config";

export async function withMetaMaskTest() {
  const [wallet, page, context] = await dappwright.bootstrap("", {
    wallet: "metamask",
    version: MetaMaskWallet.recommendedVersion,
    seed: "test test test test test test test test test test test junk",
    headless: environment.HEADLESS,
  });

  await wallet.addNetwork({
    networkName: environment.NETWORK_NAME,
    rpc: environment.RPC,
    chainId: environment.CHAIN_ID,
    symbol: environment.SYMBOL
  });

  await wallet.importPK(environment.PRIVATE_KEY_CREATE_NETWORK);
  await wallet.importPK(environment.PRIVATE_KEY);

  return { wallet, page, context };
}