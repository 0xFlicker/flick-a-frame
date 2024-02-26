import { Chain, mainnet } from "@wagmi/chains";
import { createConfig, configureChains } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { InjectedConnector } from "wagmi/connectors/injected";
import "@wagmi/core";
import {
  alchemyKey,
  appName,
  infuraKey,
  supportedChains,
  webConnectProjectId,
} from "@/utils/config";
import { lazySingleton } from "@/utils/factory";

export const appProviders = [
  infuraProvider({
    apiKey: infuraKey.get(),
  }),
  alchemyProvider({
    apiKey: alchemyKey.get(),
  }),
  publicProvider(),
];

export const appChains = lazySingleton(() => {
  return configureChains(supportedChains.get(), appProviders);
});

export type TAppConnectors =
  | MetaMaskConnector
  | WalletConnectConnector
  | CoinbaseWalletConnector
  | InjectedConnector;
export const appConnectors = lazySingleton<TAppConnectors[]>(() => {
  const { chains } = appChains.get();
  return [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: webConnectProjectId.get(),
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: appName.get(),
      },
    }),
    new InjectedConnector({ chains }),
  ];
});

export function isMetamaskConnector(connector: TAppConnectors) {
  return connector.id === "metaMask";
}
export const metamaskConnector = lazySingleton(function metamaskConnector() {
  return appConnectors.get().find(isMetamaskConnector);
});
export function isWalletConnector(connector: TAppConnectors) {
  return connector.id === "walletConnect";
}
export const walletConnectConnector = lazySingleton(
  function walletConnectConnector() {
    return appConnectors.get().find(isWalletConnector);
  }
);
export function isCoinbaseWalletConnector(connector: TAppConnectors) {
  return connector.id === "coinbaseWallet";
}
export const coinbaseWalletConnector = lazySingleton(function coinbaseWallet() {
  return appConnectors.get().find(isCoinbaseWalletConnector);
});
export function isInjectedConnector(connector: TAppConnectors) {
  return connector.id === "injected";
}
export const injectedConnector = lazySingleton(function injectedConnector() {
  return appConnectors.get().find(isInjectedConnector);
});

export const wagmiConfig = lazySingleton(() => {
  const { publicClient, webSocketPublicClient } = appChains.get();
  return createConfig({
    connectors: appConnectors.get(),
    publicClient,
    webSocketPublicClient,
  });
});

export const wagmiConfigAutoConnectConfig = lazySingleton(() => {
  const { publicClient, webSocketPublicClient } = appChains.get();
  return createConfig({
    connectors: appConnectors.get(),
    publicClient,
    webSocketPublicClient,
    autoConnect: true,
  });
});

export type WagmiConfiguredClient =
  | ReturnType<typeof wagmiConfig.get>
  | ReturnType<typeof wagmiConfigAutoConnectConfig.get>;
