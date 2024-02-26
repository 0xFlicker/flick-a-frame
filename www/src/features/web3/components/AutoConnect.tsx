import { FC, PropsWithChildren } from "react";
import { useLocalLastSeemNetwork } from "../hooks";

export const AutoConnect: FC<PropsWithChildren<{}>> = ({ children }) => {
  useLocalLastSeemNetwork({
    autoConnect: true,
  });
  return children;
};
