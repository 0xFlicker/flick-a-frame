import NextImage from "next/image";
import { FC } from "react";
import bitcoinSvg from "../../public/images/bitcoin-btc-logo.svg";

export const BitcoinIcon: FC<{ size?: number }> = ({ size = 24 }) => {
  return (
    <NextImage src={bitcoinSvg} alt="Bitcoin" width={size} height={size} />
  );
};
