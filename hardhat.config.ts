import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-web3";
import "hardhat-gas-reporter";
import dotenv from 'dotenv'
dotenv.config()


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined && process.env.PRIVATE_KEY2 !== undefined && process.env.PRIVATE_KEY3 !== undefined && process.env.PRIVATE_KEY4 !== undefined && process.env.PRIVATE_KEY5 !== undefined && process.env.PRIVATE_KEY6 !== undefined && process.env.PRIVATE_KEY7 !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY3, process.env.PRIVATE_KEY4, process.env.PRIVATE_KEY5, process.env.PRIVATE_KEY6, process.env.PRIVATE_KEY7] : [],
      // gas: 30000000,
      gasPrice: 100000000000, //100Gwei 까지 감당
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined && process.env.PRIVATE_KEY2 !== undefined && process.env.PRIVATE_KEY3 !== undefined && process.env.PRIVATE_KEY4 !== undefined && process.env.PRIVATE_KEY5 !== undefined && process.env.PRIVATE_KEY6 !== undefined && process.env.PRIVATE_KEY7 !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY3, process.env.PRIVATE_KEY4, process.env.PRIVATE_KEY5, process.env.PRIVATE_KEY6, process.env.PRIVATE_KEY7] : [],
      // process.env.PRIVATE_KEY !== undefined && process.env.PRIVATE_KEY2 !== undefined && process.env.PRIVATE_KEY3 !== undefined  ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY3] : [],
      // gas: 30000000,
      gasPrice: 100000000000, //100Gwei까지 감당
    },
    mainnet: {
      chainId: 1,
      url: process.env.MAINNET_URL,
      accounts:
        process.env.PRIVATE_KEY_MAINNET !== undefined ? [process.env.PRIVATE_KEY_MAINNET] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false
  }
};

export default config;