import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract, providers } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { isAddress } from "ethers/lib/utils";
import { Signing } from "./encrypt";



describe("Background", function () {
    let background: Contract;
    const quantity = 5000;
    let owner: SignerWithAddress;
    let addr: SignerWithAddress;
    const baseUri = 'https://gateway.pinata.cloud/ipfs/';
    const customUri = 'Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr';
  
    beforeEach(async function () {
      [owner, addr] = await ethers.getSigners();
  
      const Background = await ethers.getContractFactory("Background");
      background = await Background.deploy();
      await background.deployed();
    })
  
    describe("Mint", function () {
      it("test4", async function () {
        let sign = Signing(addr.address, background.address, customUri);
        console.log(background.address);
        console.log(sign);
  
        const tx = await background.connect(addr).publicSale(sign.cid, sign.nonce, sign.hash, sign.signature);
        const receipt = await tx.wait();
  

        console.log(tx);


        expect(1).to.not.be.undefined;

        // // console.log('total ether spent on gas for transaction: \t', ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)))
        // // console.log('balance difference minus transaction value: \t', ethers.utils.formatEther(addr1Bal.sub(await provider.getBalance(addr1.address)).sub(txValue)))
      
        // const tx2 = await background.connect(owner).tokenURI(0);
        
      });
  
  
  
    })
  
  
  });
  