import { createConfig } from "wagmi";
import { http, defineChain } from "viem";

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set");
}

const fios = defineChain({
  id: 91903,
  name: "Fios",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://fios-v0.alt.technology"],
      webSocket: ["wss://fios-v0.alt.technology/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://fios-v0-explorer.alt.technology",
    },
  },
});

export const config = createConfig({
  chains: [fios],
  transports: {
    [fios.id]: http(),
  },
  ssr: true,
});