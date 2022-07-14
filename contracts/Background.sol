//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract Background is ERC721, Ownable {
    constructor() ERC721("Genesis Voice Serum", "GVS") {}

    using ECDSA for bytes32;

    address private _systemAddress = 0xdaCa757514D2572d1E64cB8AbA678ecafA0D6e3D;
    mapping(string => bool) public _usedNonces;

    function publicSale(
        string memory cid,
        string memory customNonce,
        bytes32 hash,
        bytes memory signature
    ) external payable {
        // signature realted
        require(matchSigner(hash, signature), "Plz mint through website");
        require(!_usedNonces[customNonce], "Hash reused");
        require(
            hashTransaction(msg.sender, cid, customNonce) == hash,
            "Hash failed"
        );

        _usedNonces[customNonce] = true;

        // start minting
        // uint256 currentSupply = totalSupply();

        // for (uint256 i = 1; i <= amount; i++) {
        //   _safeMint(msg.sender, currentSupply + i);
        // }
    }

    function matchSigner(bytes32 hash, bytes memory signature)
        public
        view
        returns (bool)
    {
        return
            _systemAddress == hash.toEthSignedMessageHash().recover(signature);
    }

    function hashTransaction(
        address sender,
        string memory cid,
        string memory customNonce
    ) public view returns (bytes32) {
        bytes32 hash = keccak256(
            abi.encodePacked(sender, address(this), cid, customNonce)
        );

        return hash;
    }
}
