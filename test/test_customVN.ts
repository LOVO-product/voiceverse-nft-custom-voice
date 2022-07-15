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
  const customUri = 'Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr';//46byte 
  const customUri2 = '2ma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr';
  const customUri_fake = 'Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkz';
  const privateKey = '0x4dfc9e11b48940aef89baf6a525fa7840caffd1cd3a2ccf6ec0cff78f8898ebe';
  const publicKey = '0xdaCa757514D2572d1E64cB8AbA678ecafA0D6e3D';
  const privateKey2 = 'fa5ddcd542a9e71a560f17f6b299c8d9ecc1142807ab51a8b603939ff8320ce5';
  const pulbicKey2 = '0xcE0ecb3B16d020D3B8F2DD81ED5A1fbBb2180D24';

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
      // console.log(sign)
      await expect(
        customVoiceNft.connect(addr).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature)
      ).to.emit(customVoiceNft, "MintLog").withArgs(addr.address, 0);
    });

    it("Should success setting base & custom uri", async function () {
      let sign = Signing(addr.address, customVoiceNft.address, customUri, privateKey);

      const tx = await customVoiceNft.connect(addr).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature);

      expect(tx).to.not.be.undefined;
      await customVoiceNft.setBaseURI(baseUri);
      const tx2 = await customVoiceNft.connect(addr).tokenURI(0);

      expect(tx2).to.equal(baseUri + customUri);

    });

    it("Should success minting 2 nfts, one by one", async function () {
      let sign = Signing(addr.address, customVoiceNft.address, customUri, privateKey);

      const tx = await customVoiceNft.connect(addr).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature);

      expect(tx).to.not.be.undefined;
      await customVoiceNft.setBaseURI(baseUri);
      const tx2 = await customVoiceNft.connect(addr).tokenURI(0);

      expect(tx2).to.equal(baseUri + customUri);


      let sign2 = Signing(addr.address, customVoiceNft.address, customUri2, privateKey);
      await customVoiceNft.connect(addr).publicMint(sign2.cid, sign2.nonce, sign2.hash, sign2.signature);
      const tx3 = await customVoiceNft.connect(addr).tokenURI(1);

      expect(tx3).to.equal(baseUri + customUri2);

    });

    it("Should success changing signature", async function () {
      let sign = Signing(addr.address, customVoiceNft.address, customUri, privateKey2);

      await customVoiceNft.connect(owner).setSystemAddress(pulbicKey2);
      const tx = await customVoiceNft.connect(addr).publicMint(sign.cid, sign.nonce, sign.hash, sign.signature);

      expect(tx).to.not.be.undefined;
      await customVoiceNft.setBaseURI(baseUri);
      const tx2 = await customVoiceNft.connect(addr).tokenURI(0);

      expect(tx2).to.equal(baseUri + customUri);

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

        await expect(
          customVoiceNft.connect(owner).toggleMintLive()
        ).to.emit(customVoiceNft, "MintLiveLog").withArgs(true);
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
