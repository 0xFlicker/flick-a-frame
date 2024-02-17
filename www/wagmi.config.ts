import { defineConfig, Config } from "@wagmi/cli";
import { blockExplorer } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/wagmi/generated.ts",
  plugins: [
    blockExplorer({
      baseUrl: "https://api.basescan.org/api",
      contracts: [
        {
          name: "TGE1",
          address: "0x69DC24F76dD15C11Db043DE09D8f1FB57b9A00fC",
        },
      ],
    }),
  ],
}) as Config;
