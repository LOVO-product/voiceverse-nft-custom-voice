import { ethers } from "hardhat";
import { Signing } from "../test/encrypt";

async function main() {
  // let [owner, addr1, addr2, addr3, addr4, addr5, addr6] = await ethers.getSigners();
  let [owner] = await ethers.getSigners();

  //========================================================================================================================
  // Is this right?
  const baseUri = 'https://lovo.mypinata.cloud/ipfs/';
  //========================================================================================================================
  // const baseUri = 'https://gateway.pinata.cloud/ipfs/';

  // Initial Deploy contract
  const CustomVoiceNft = await ethers.getContractFactory("CustomVoiceNFT");
  const customVoiceNft = await CustomVoiceNft.deploy(baseUri, "0xfF4141a674B2aD9676Db4A2ee5F616Ca85F67F4C");// _baseTokenURI, _systemAddress
  await customVoiceNft.deployed();

  console.log("CustomVoice deployed to:", customVoiceNft.address);
  const txToggle = await customVoiceNft.connect(owner).toggleMintLive();


  //========================================================================================================================
  // Interact 
  //========================================================================================================================

  // const deployAddress = "0x2FA8CD579586ac8cE61d0E700bdFc7f0Bb815e6C"//Ropsten

  // const CustomVoiceNft = await ethers.getContractFactory("CustomVoiceNFT");
  // const customVoiceNft = CustomVoiceNft.attach(
  //   deployAddress
  // );
  // //TODO 임시
  // const prvK = '4dfc9e11b48940aef89baf6a525fa7840caffd1cd3a2ccf6ec0cff78f8898ebe';
  // const customUri = 'Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr';//46byte 

  // let sign = Signing(owner.address, customVoiceNft.address, customUri, prvK);
  // // console.log(sign);

  // const maxFeePG = ethers.utils.parseUnits('30', 'gwei').toNumber();
  // const maxPriorityFPG = ethers.utils.parseUnits('1.5', 'gwei').toNumber();
  // const tx = await customVoiceNft.connect(owner).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature, {
  //   maxFeePerGas: maxFeePG,//30Gwei
  //   maxPriorityFeePerGas: maxPriorityFPG//1.5
  // });
  // const mintTxnResponse = await tx.wait();

  // console.log(mintTxnResponse);


  //========================================================================================================================
  // READ
  //========================================================================================================================


  // const etherscanProvider = new ethers.providers.AlchemyProvider("ropsten", "0RFvC1kJM_33G5GAnthpilrsLM_2Kk2m")

  //   let address = "0xa563ba49d2e6b7635c7b27bdce7a7ff44ee80fc77504d4fd0242cd8294b30b8c"; 


  //       let tx = await etherscanProvider.getTransaction(address);
  //       console.log(tx);

  //       let tx2 = await etherscanProvider.getTransactionReceipt(address);
  //       console.log('============');
  //       console.log(tx2);
  //       console.log(tx2.logs[0]);
  //       console.log('============');

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
