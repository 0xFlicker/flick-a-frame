import NextImage from "next/image";
import { FC } from "react";
import ethereumSvg from "../../public/images/ethereum-eth-logo.svg";

export const EthereumIcon: FC<{ size?: number; hidden?: boolean }> = ({
  size = 24,
  hidden,
}) => {
  return (
    <NextImage
      src={ethereumSvg}
      alt="Ethereum"
      width={size}
      height={size}
      style={{
        ...(hidden ? { visibility: "hidden" } : {}),
      }}
    />
  );
};
