const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("Lock", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    // Contracts are deployed using the first signer/account by default

    let owner , a1 , a2 , myEpicGame;
    describe("tests", async function () {
        it("deploy", async function () {
            [owner, a1 , a2] = await ethers.getSigners();
        
            let MyEpicGame = await ethers.getContractFactory("MyEpicGame");
            myEpicGame = await MyEpicGame.deploy(
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
        });
        it("test1", async function () {
            let txn;
            txn = await myEpicGame.mintCharacterNFT(2);
            await txn.wait();    
            
            await myEpicGame.attackBoss()
        });
    });

  
  });
  