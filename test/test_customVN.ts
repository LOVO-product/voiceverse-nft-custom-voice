import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract, providers } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { isAddress } from "ethers/lib/utils";
import { Signing } from "./encrypt";



describe("CustomVoiceNFT", function () {
    let background: Contract;
    const quantity = 5000;
    let owner: SignerWithAddress;
    let addr: SignerWithAddress;
    const baseUri = 'https://gateway.pinata.cloud/ipfs/';
    const customUri = 'Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr';
  
    beforeEach(async function () {
      [owner, addr] = await ethers.getSigners();
      const Background = await ethers.getContractFactory("CustomVoiceNFT");
      background = await Background.deploy();
      await background.deployed();

      const tx = await background.connect(owner).setBaseURI(baseUri);
      
    })
  
    describe("Success Scenario", function () {
      it("mint", async function () {
        let sign = Signing(addr.address, background.address, customUri);
        console.log(background.address);
        console.log(sign);
  
        const tx = await background.connect(addr).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature);
        const receipt = await tx.wait();
  

        // console.log(tx);


        expect(1).to.not.be.undefined;
        
      });
  
  
  
    })
  
  
  });
  