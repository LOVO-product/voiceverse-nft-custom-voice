//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.15;

import "./CustomVoiceNFT.sol";
import "hardhat/console.sol";

contract Attacker {
    function tryMint(
        address _addr,
        string memory _cid,
        string memory _customNonce,
        bytes32 _hash,
        bytes memory _signature
    ) public {
        //
        CustomVoiceNFT cvNFT = CustomVoiceNFT(_addr);
        cvNFT.publicMint(_cid, _customNonce, _hash, _signature);
    }

    function test(address _addr) public view {
        CustomVoiceNFT cvNFT = CustomVoiceNFT(_addr);
        console.log(cvNFT.totalMinted());
    }
}
