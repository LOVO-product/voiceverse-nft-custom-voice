import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract, providers } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { isAddress } from "ethers/lib/utils";


describe.skip("ERC721A", function () {
  let original: Contract;
  const quantity = 5000;
  let owner: SignerWithAddress;
  let addr: SignerWithAddress;
  const baseUri = 'https://gateway.pinata.cloud/ipfs/Qma6dfwsYZ1kf1QAPkqbUSvsZ5DwjRdLSxKq2md7eWDjkr';

  beforeEach(async function () {
    [owner, addr] = await ethers.getSigners();

    const Original = await ethers.getContractFactory("Original");
    original = await Original.deploy();
    await original.deployed();
  })

  describe("APIConsumer", function () {
    it("test", async function () {

      const tx = await original.connect(owner).mint(1);
      expect(tx).to.not.be.undefined;
      const receipt = await tx.wait();

      console.log(receipt.gasUsed);
      // console.log('total ether spent on gas for transaction: \t', ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)))
      // console.log('balance difference minus transaction value: \t', ethers.utils.formatEther(addr1Bal.sub(await provider.getBalance(addr1.address)).sub(txValue)))
    });



  })


});


