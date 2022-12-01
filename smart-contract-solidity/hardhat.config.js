require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      url: process.env.QUICKNODE_API_URL,
      accounts: [process.env.PVT_KEY],
    },
  },
};