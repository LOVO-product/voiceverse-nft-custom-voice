import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Signing } from "./encrypt";



describe("CustomVoiceNFT", function () {
    let customVoiceNft: Contract;
    let owner: SignerWithAddress;
    let addr: SignerWithAddress;
    let addr2: SignerWithAddress;

    const baseUri = 'https://gateway.pinata.cloud/ipfs/';
    const customUri = 'Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr';
    const customUri2 = '2ma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr';
    const customUri_fake = 'Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkz';
    const privateKey = '0x4dfc9e11b48940aef89baf6a525fa7840caffd1cd3a2ccf6ec0cff78f8898ebe';
    const publicKey = '0xdaCa757514D2572d1E64cB8AbA678ecafA0D6e3D';

    beforeEach(async function () {
      [owner, addr, addr2] = await ethers.getSigners();
      const Background = await ethers.getContractFactory("CustomVoiceNFT");
      customVoiceNft = await Background.deploy(baseUri, publicKey);
      await customVoiceNft.deployed();

      // const tx = await customVoiceNft.connect(owner).setBaseURI(baseUri);

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
  
      it("Should success setting base & custom uri", async function () {
        let sign = Signing(addr.address, customVoiceNft.address, customUri, privateKey);
  
        const tx = await customVoiceNft.connect(addr).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature);
  
        expect(tx).to.not.be.undefined;
        await customVoiceNft.setBaseURI(baseUri);
        const tx2 = await customVoiceNft.connect(addr).tokenURI(0);
    
        expect(tx2).to.equal(baseUri+customUri); 
        
      });

      it("Should success minting 2 nfts, one by one", async function () {
        let sign = Signing(addr.address, customVoiceNft.address, customUri, privateKey);
  
        const tx = await customVoiceNft.connect(addr).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature);
  
        expect(tx).to.not.be.undefined;
        await customVoiceNft.setBaseURI(baseUri);
        const tx2 = await customVoiceNft.connect(addr).tokenURI(0);
    
        expect(tx2).to.equal(baseUri+customUri); 


        let sign2 = Signing(addr.address, customVoiceNft.address, customUri2, privateKey);
        await customVoiceNft.connect(addr).publicMint(sign2.cid, sign2.nonce, sign2.hash, sign2.signature);
        const tx3 = await customVoiceNft.connect(addr).tokenURI(1);
    
        expect(tx3).to.equal(baseUri+customUri2); 
        
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

        it("Should fail mint - tried other person's ", async function () {
          let sign = Signing(addr.address, customVoiceNft.address, customUri, privateKey);
  
          await expect(
            customVoiceNft.connect(addr2).publicMint(customUri_fake, sign.nonce, sign.hash, sign.signature)
          ).to.be.revertedWith("Hash failed");
          
  
        });
      })
     
      
    })
  
  
  });
  