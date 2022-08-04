import { ethers } from "hardhat";
import { Signing } from "../test/encrypt";

async function main() {
  // let [owner, addr1, addr2, addr3, addr4, addr5, addr6] = await ethers.getSigners();
  let [owner, addr1] = await ethers.getSigners();

  //========================================================================================================================
  // Is this right?
  // const baseUri = 'https://lovo.mypinata.cloud/ipfs/';
  //========================================================================================================================
  const baseUri = 'https://gateway.pinata.cloud/ipfs/';

  // Deploy contract
  // const CustomVoiceNft = await ethers.getContractFactory("CustomVoiceNFT");
  // const customVoiceNft = await CustomVoiceNft.deploy(baseUri , "0xdaCa757514D2572d1E64cB8AbA678ecafA0D6e3D");// _baseTokenURI, _systemAddress
  // await customVoiceNft.deployed();

  // console.log("SerumAirdrop deployed to:", customVoiceNft.address);
  // const txToggle = await customVoiceNft.connect(owner).toggleMintLive();


  const deployAddress = "0x07d60405C4B3565dce1eFB04A76326deB8F554DD"//Ropsten

  const CustomVoiceNft = await ethers.getContractFactory("CustomVoiceNFT");
  const customVoiceNft = CustomVoiceNft.attach(
    deployAddress
  );
  //TODO 임시
  const prvK = '4dfc9e11b48940aef89baf6a525fa7840caffd1cd3a2ccf6ec0cff78f8898ebe';
  const customUri = 'Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr';//46byte 

  let sign = Signing(owner.address, customVoiceNft.address, customUri, prvK);
  // console.log(sign);

  const maxFeePG = ethers.utils.parseUnits('30', 'gwei').toNumber();
  const maxPriorityFPG = ethers.utils.parseUnits('1.5', 'gwei').toNumber();
  const tx = await customVoiceNft.connect(owner).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature, {
    maxFeePerGas: maxFeePG,//30Gwei
    maxPriorityFeePerGas: maxPriorityFPG//1.5
  });
  const mintTxnResponse = await tx.wait();

  console.log(mintTxnResponse);


}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
