import { web3 } from "hardhat";
const crypto = require("crypto");

const generateNonce = () => {
  return crypto.randomBytes(16).toString("hex");
};

// Hash message
const mintMsgHash = (recipient: string, contract: string, cid: string, newNonce: string ) => {
  return (
    web3.utils.soliditySha3(
      { t: "address", v: recipient },
      { t: "address", v: contract },
      { t: "string", v: cid },
      { t: "string", v: newNonce },
    ) || ""
  );
};

const signMessage = (msgHash: string, privateKey: string) => {
    return web3.eth.accounts.sign(msgHash, privateKey);
};

// Signing the message at backend.
// You can store the data at database or check for Nonce conflict 
export const Signing = (address: string, ContractAddress: string, cid: string, privateKey: string) => {
  const newNonce = generateNonce();
 
  const hash = mintMsgHash(
    address,
    ContractAddress,
    cid,
    newNonce    
  );

  const signner = signMessage(hash, privateKey);
  
  return {
    cid: cid,
    nonce: newNonce,
    hash: signner.message,
    signature: signner.signature,
  };
  
}