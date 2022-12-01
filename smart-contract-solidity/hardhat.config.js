require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      url: 'https://omniscient-wandering-hexagon.ethereum-goerli.discover.quiknode.pro/5cf0097488240ec6c843cc7c287fba03c7dabdf5/',
      accounts: ['491619110b7cdb4c31bc6baeac04d7b0eb987e28f9555ef7801df6a61ac02b89'],
    },
  },
};