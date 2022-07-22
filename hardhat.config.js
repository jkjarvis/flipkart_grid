require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/00277a64a41a4c79a3dcaaf48e21e088",
      accounts: [privateKey],
    },
    mainnet: {
      url: "https://polygon-mainnet.infura.io/v3/00277a64a41a4c79a3dcaaf48e21e088",
      accounts: [privateKey],
    },
  },
  solidity: "0.8.4",
};
