import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  useAccount,
  useConnect,
  Chain,
  useNetwork,
  useDisconnect,
  useSwitchNetwork,
} from "wagmi";
import "@wagmi/core";
import "@wagmi/connectors";
import { defaultChain } from "@/utils/config";
import { appConnectors } from "./wagmi";
import { useDeferFirstRender } from "@/hooks/useDeferredRender";

export type TChain = Chain & {
  chainImageUrl: string;
};
export function decorateChainImageUrl(chain?: Chain): string {
  let chainImageUrl = "/images/chains/unknown.png";
  switch (chain?.id) {
    case 1:
      chainImageUrl = "/images/chains/homestead.png";
      break;
    case 111_55_111:
      chainImageUrl = "/images/chains/sepolia.png";
      break;
    case 5:
      chainImageUrl = "/images/chains/goerli.png";
      break;
    default:
      chainImageUrl = "/images/chains/unknown.png";
  }
  return chainImageUrl;
}

export const useLocalLastSeemNetwork = ({
  autoConnect = true,
}: {
  autoConnect?: boolean;
}) => {
  const { connector: activeConnector, isConnected } = useAccount();
  const { connectAsync } = useConnect();

  useEffect(() => {
    if (autoConnect && !isConnected) {
      const lastSeenConnector = localStorage.getItem("lastSeenConnector");
      if (lastSeenConnector) {
        const { connectorName } = JSON.parse(lastSeenConnector);
        if (connectorName) {
          const connector = appConnectors
            .get()
            .find((c) => c.name === connectorName);
          if (connector) {
            connectAsync({
              connector,
            }).then(() => {});
          }
        }
      }
    }
  }, [autoConnect, isConnected, activeConnector, connectAsync]);
};

export function useWeb3Context() {
  const [triedDefaultChain, setTriedDefaultChain] = useState(false);
  const { connector: activeConnector, isConnected, address } = useAccount();
  const { connect, isLoading, data: provider } = useConnect();
  const { disconnect } = useDisconnect();
  // We don't want the address to be available on first load so that client render matches server render
  const isFirstLoad = useDeferFirstRender();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  useEffect(() => {
    if (isConnected && activeConnector?.name) {
      localStorage.setItem(
        "lastSeenConnector",
        JSON.stringify({
          connectorName: activeConnector.name,
        })
      );
    }
  }, [isConnected, activeConnector]);
  useEffect(() => {
    if (
      !triedDefaultChain &&
      chain?.id !== defaultChain.get().id &&
      switchNetwork
    ) {
      switchNetwork(defaultChain.get().id);
      setTriedDefaultChain(true);
    }
  }, [isFirstLoad, chain, switchNetwork, triedDefaultChain]);

  const result = {
    currentChain: isFirstLoad ? undefined : chain,
    provider,
    selectedAddress: isFirstLoad ? undefined : address,
    connect,
    reset: disconnect,
    activeConnector,
    isConnected,
    isLoading,
  };

  return result;
}

type TContext = ReturnType<typeof useWeb3Context>;
const Web3Provider = createContext<TContext | null>(null);

export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const context = useWeb3Context();
  return (
    <Web3Provider.Provider value={context}>{children}</Web3Provider.Provider>
  );
};

export function useWeb3() {
  const context = useContext(Web3Provider);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
