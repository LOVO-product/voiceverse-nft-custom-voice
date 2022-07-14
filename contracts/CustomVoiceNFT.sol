//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.15;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract CustomVoiceNFT is ERC721A, Ownable {
    using ECDSA for bytes32;

    uint256 public count;
    address public ownerAddr;
    address private _systemAddress = 0xdaCa757514D2572d1E64cB8AbA678ecafA0D6e3D;
    mapping(string => bool) public usedNonces;
    mapping(uint256 => string) public customUrl;
    bool public isMintLive;
    string public baseTokenURI;


    event MintLiveLog(bool live);
    event MintLog(bool live);

    constructor() ERC721A("My Test", "MTS") {
        count = 0;
        ownerAddr = msg.sender;
    }

    function publicMint(
        string memory cid,
        string memory customNonce,
        bytes32 hash,
        bytes memory signature
    ) external payable {
        // signature realted
        require(matchSigner(hash, signature), "Mint through website");
        require(!usedNonces[customNonce], "Hash reused");
        require(
            hashTransaction(msg.sender, cid, customNonce) == hash,
            "Hash failed"
        );

        usedNonces[customNonce] = true;

        // start minting
        customUrl[_nextTokenId()] = cid;
        _mint(msg.sender, 1);
    }

    //=============================================================
    //  auth
    //=============================================================
    function matchSigner(bytes32 hash, bytes memory signature)
        private
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
    ) private view returns (bytes32) {
        bytes32 hash = keccak256(
            abi.encodePacked(sender, address(this), cid, customNonce)
        );

        return hash;
    }

    //=============================================================
    //  operation
    //=============================================================

    function toggleMintLive() external onlyOwner {
        bool isLive = !isMintLive;
        isMintLive = isLive;
        emit MintLiveLog(isMintLive);
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    //=============================================================
    //  utility
    //=============================================================

    function totalMinted() public view returns (uint256) {
        return _totalMinted();
    }

    function tokensOfOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 holdingAmount = balanceOf(owner);
        uint256 tokenIdsIdx;
        address currOwnershipAddr;

        uint256[] memory list = new uint256[](holdingAmount);

        unchecked {
            for (uint256 i; i < count; i++) {
                TokenOwnership memory ownership = _ownershipAt(i);

                if (ownership.burned) {
                    continue;
                }

                if (ownership.addr != address(0)) {
                    currOwnershipAddr = ownership.addr;
                }

                if (currOwnershipAddr == owner) {
                    list[tokenIdsIdx++] = i;
                }

                if (tokenIdsIdx == holdingAmount) {
                    break;
                }
            }
        }

        return list;
    }
}
