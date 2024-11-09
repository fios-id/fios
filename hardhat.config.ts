import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    fios: {
      url: "https://fios-v0.alt.technology",
      accounts: process.env.CONTRACT_OWNER_PRIVATE_KEY
        ? [process.env.CONTRACT_OWNER_PRIVATE_KEY]
        : [],
      chainId: 91903,
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      accounts: process.env.CONTRACT_OWNER_PRIVATE_KEY
        ? [process.env.CONTRACT_OWNER_PRIVATE_KEY]
        : [],
      chainId: 97,
      gasPrice: 10000000000, // 10 Gwei
    },
  },
  etherscan: {
    apiKey: {
      fios: "not-required",
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "fios",
        chainId: 91903,
        urls: {
          apiURL: "https://fios-v0-explorer.alt.technology/api",
          browserURL: "https://fios-v0-explorer.alt.technology",
        },
      },
    ],
  },
};

module.exports = config;
