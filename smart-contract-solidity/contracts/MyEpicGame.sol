// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "./libraries/Base64.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";



contract MyEpicGame is ERC721 {

  uint randNonce = 0; // this is used to help ensure that the algorithm has different inputs every time

    function randomInt(uint _modulus) public returns(uint) {
      randNonce++;                                                     
      return uint(keccak256(abi.encodePacked(block.timestamp,msg.sender,randNonce))) % _modulus; 
    }

  struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;        
    uint hp;
    uint maxHp;
    uint attackDamage;
  }

  struct BigBoss {
    string name;
    string imageURI;
    uint hp;
    uint maxHp;
    uint attackDamage;
  }

  BigBoss public bigBoss;


  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;


  CharacterAttributes[] defaultCharacters;

  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
  mapping(address => uint256) public nftHolders;

  event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
  event AttackComplete(address sender, uint newBossHp, uint newPlayerHp);


  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg,
    string memory bossName, // These new variables would be passed in via run.js or deploy.js.
    string memory bossImageURI,
    uint bossHp,
    uint bossAttackDamage
  ) ERC721("Heroes", "HERO")
  {
    for(uint i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(CharacterAttributes({
        characterIndex: i,
        name: characterNames[i],
        imageURI: characterImageURIs[i],
        hp: characterHp[i],
        maxHp: characterHp[i],
        attackDamage: characterAttackDmg[i]
      }));

      CharacterAttributes memory c = defaultCharacters[i];
      console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);

      bigBoss = BigBoss({
        name: bossName,
        imageURI: bossImageURI,
        hp: bossHp,
        maxHp: bossHp,
        attackDamage: bossAttackDamage
      });
    }

      _tokenIds.increment();
  }

  function mintCharacterNFT(uint _characterIndex) external {
    uint256 newItemId = _tokenIds.current();

    _safeMint(msg.sender, newItemId);

    nftHolderAttributes[newItemId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].maxHp,
      attackDamage: defaultCharacters[_characterIndex].attackDamage
    });

    console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);
    
    nftHolders[msg.sender] = newItemId;

    _tokenIds.increment();

    emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);

  }


  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
  CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

  string memory strHp = Strings.toString(charAttributes.hp);
  string memory strMaxHp = Strings.toString(charAttributes.maxHp);
  string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

  string memory json = Base64.encode(
    abi.encodePacked(
      '{"name": "',
      charAttributes.name,
      ' -- NFT #: ',
      Strings.toString(_tokenId),
      '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
      charAttributes.imageURI,
      '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
      strAttackDamage,'} ]}'
    )
  );

  string memory output = string(
    abi.encodePacked("data:application/json;base64,", json)
  );
  
  return output;
}


function attackBoss() public {
  // Get the state of the player's NFT.
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
  console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

  require (player.hp > 0,"Error: character must have HP to attack boss.");
  require (bigBoss.hp > 0,"Error: boss must have HP to attack character.");


  console.log("%s swings at %s...", player.name, bigBoss.name);        
  if (bigBoss.hp < player.attackDamage) {
    bigBoss.hp = 0;
    console.log("The boss is dead!");

  } else {
    if (randomInt(10) > 5) { 
        bigBoss.hp = bigBoss.hp - player.attackDamage;
        console.log("%s attacked boss. New boss hp: %s", player.name, bigBoss.hp);
    } else {
        console.log("%s missed!\n", player.name);
    }
  }

  if (player.hp < bigBoss.attackDamage) {
    player.hp = 0;
  } else {
    player.hp = player.hp - bigBoss.attackDamage;
  }
  console.log("%s player attacked %s boss. New boss hp: %s", player.name, bigBoss.name, bigBoss.hp);
  console.log("%s boss attacked %s player. New player hp: %s\n", bigBoss.name, player.name, player.hp);

  emit AttackComplete(msg.sender, bigBoss.hp, player.hp);

}

function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
  uint256 userNftTokenId = nftHolders[msg.sender];

  if (userNftTokenId > 0) {
    return nftHolderAttributes[userNftTokenId];
  } else {
    CharacterAttributes memory emptyStruct;
    return emptyStruct;
   }
}

function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
  return defaultCharacters;
}

function getBigBoss() public view returns (BigBoss memory) {
  return bigBoss;
}
}