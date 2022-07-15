import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Signing } from "./encrypt";



describe("CustomVoiceNFT", function () {
    let customVoiceNft: Contract;
    let owner: SignerWithAddress;
    let addr: SignerWithAddress;
    const baseUri = 'https://gateway.pinata.cloud/ipfs/';
    const customUri = 'Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr';
    const customUri_fake = 'Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkz';
    const privateKey = '0x4dfc9e11b48940aef89baf6a525fa7840caffd1cd3a2ccf6ec0cff78f8898ebe';
  
    beforeEach(async function () {
      [owner, addr] = await ethers.getSigners();
      const Background = await ethers.getContractFactory("CustomVoiceNFT");
      customVoiceNft = await Background.deploy();
      await customVoiceNft.deployed();

      const tx = await customVoiceNft.connect(owner).setBaseURI(baseUri);

    })
  
    describe("Success Scenario", function () {
      beforeEach(async function () {
        await customVoiceNft.connect(owner).toggleMintLive();
      })

      it("Should success mint", async function () {
        let sign = Signing(addr.address, customVoiceNft.address, customUri, privateKey);
        // console.log(customVoiceNft.address);
        // console.log(sign);
  
        const tx = await customVoiceNft.connect(addr).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature);
        const receipt = await tx.wait();
        const tx2 = await customVoiceNft.connect(addr).tokenURI(0);
        expect(tx2).to.not.be.undefined;
        
      });
  
      it("Should success setting custom uri", async function () {
        let sign = Signing(addr.address, customVoiceNft.address, customUri, privateKey);
  
        const tx = await customVoiceNft.connect(addr).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature);
        const receipt = await tx.wait();
  
        expect(1).to.not.be.undefined;

        const tx2 = await customVoiceNft.connect(addr).tokenURI(0);
        console.log(tx2);
        
      });
  
  
    })

    describe("Failure Scenario", function () {
      describe("Should Fail", function () {
        it("Should fail mint - mint toggle not activated", async function () {
          let sign = Signing(addr.address, customVoiceNft.address, customUri, privateKey);
  
          await expect(
            customVoiceNft.connect(addr).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature)
          ).to.be.revertedWith("Not live");
          
        });
      })

      describe("Should Fail2", function () {
        beforeEach(async function () {
          await customVoiceNft.connect(owner).toggleMintLive();
        })
  
        it("Should fail mint - didn't signed in properly", async function () {
      
          let sign = Signing(addr.address, customVoiceNft.address, customUri, privateKey);
          const tx = await customVoiceNft.connect(addr).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature);
  
          await expect(
            customVoiceNft.connect(addr).publicMint(customUri_fake, sign.nonce, sign.hash, sign.signature)
          ).to.be.revertedWith("Hash reused");
          
        });
  
        it("Should fail mint - reused Hash", async function () {
          let sign = Signing(addr.address, customVoiceNft.address, customUri, privateKey);
          const tx = await customVoiceNft.connect(addr).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature);
  
          await expect(
            customVoiceNft.connect(addr).publicMint(customUri_fake, sign.nonce, sign.hash, sign.signature)
          ).to.be.revertedWith("Hash reused");
          
        });
  
        it("Should fail mint - changed customUri", async function () {
          let sign = Signing(addr.address, customVoiceNft.address, customUri, privateKey);
  
          await expect(
            customVoiceNft.connect(addr).publicMint(customUri_fake, sign.nonce, sign.hash, sign.signature)
          ).to.be.revertedWith("Hash failed");
          
  
        });
      })
     
      
    })
  
  
  });
  