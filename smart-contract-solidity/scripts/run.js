// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const MyEpicGameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const myEpicGameContract = await MyEpicGameContractFactory.deploy(
    ["Leo", "Aang", "Pikachu"],       // Names
    ["https://i.imgur.com/pKd5Sdk.png", // Images
    "https://i.imgur.com/xVu4vFL.png", 
    "https://i.imgur.com/WMB6g9u.png"],
    [100, 200, 300],                    // HP values
    [100, 50, 25],                     // Attack damage values,
    "Farza", // Boss name
    "https://i.imgur.com/AksR0tt.png", // Boss image
    10000, // Boss hp
    50 // Boss attack damage
  );
    await myEpicGameContract.deployed();

  console.log(`MyEpicGame deployed to ${myEpicGameContract.address}`);
  let returnedTokenUri = await myEpicGameContract.tokenURI(1);

  let txn;
  txn = await myEpicGameContract.mintCharacterNFT(2);
  await txn.wait();    

  txn = await myEpicGameContract.attackBoss();
  await txn.wait();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
