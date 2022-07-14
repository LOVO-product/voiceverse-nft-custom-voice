import { ethers } from "hardhat";

async function main() {
  let [owner, addr1, addr2, addr3, addr4, addr5, addr6] = await ethers.getSigners();
  //========================================================================================================================
  // Is this right?
  const baseUri = 'https://lovo.mypinata.cloud/ipfs/QmRaZaBPChJc4HhRUqFZDCpHidjZ6dbHHGLpBa4RA6hsvu/';
  //========================================================================================================================


  // Deploy contract
  const SerumAirdrop = await ethers.getContractFactory("SerumAirdrop");
  const serumAirdrop = await SerumAirdrop.deploy();
  await serumAirdrop.deployed();

  console.log("SerumAirdrop deployed to:", serumAirdrop.address);

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
