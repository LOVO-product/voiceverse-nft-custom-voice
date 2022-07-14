//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.15;

//                   .
//
//                    *
//                  .
//    o
//     \_/\o       O
//    ( Oo)          .
//    (_=-)        *  O
//    /   \              .
//    ||  |\_        o
//    \\  |\.=     o   *
//    {K  |      _________
//     | PP    c(`       ')o
//     | ||      \.     ,/
//     (__\\    _//^---^\\_

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Storage is ERC721URIStorage, Ownable {
    constructor() ERC721("MyToken", "MTK") {}

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;


    function mintNFT(address recipient, string memory _tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        console.log(newItemId);
        return newItemId;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override( ERC721URIStorage)
        returns (string memory)
    {
        console.log(super.tokenURI(tokenId));
        return super.tokenURI(tokenId);
    }
    // function setTorkenUri(uint256 tokenId, string memory _tokenURI) public {
    //     _setTokenURI(tokenId, _tokenURI);
    // }
}
