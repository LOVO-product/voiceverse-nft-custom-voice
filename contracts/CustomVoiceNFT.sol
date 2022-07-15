//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.15;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract CustomVoiceNFT is ERC721A, Ownable {
    using ECDSA for bytes32;

    //TODO struct 고려하기
    address public ownerAddr;//20byte
    address private systemAddress;//20byte
    string public baseTokenURI;//34 byte ->takes 64 byte

    bool public isMintLive;

    mapping(string => bool) public usedNonces;
    mapping(uint256 => string) public customUrl;

    event MintLiveLog(bool live);
    event MintLog(address indexed to, uint256 indexed tokenId);

    constructor(string memory _baseTokenURI, address _systemAddress)
        ERC721A("My Test", "MTS")
    {
        ownerAddr = msg.sender;
        baseTokenURI = _baseTokenURI;
        systemAddress = _systemAddress;
    }

    modifier checkSignature(
        string memory cid,
        string memory customNonce,
        bytes32 hash,
        bytes memory signature
    ) {
        require(matchSigner(hash, signature), "Mint through website");
        require(!usedNonces[customNonce], "Hash reused");
        require(
            hashTransaction(msg.sender, cid, customNonce) == hash,
            "Hash failed"
        );
        _;
    }

    function publicMint(
        string memory cid,
        string memory customNonce,
        bytes32 hash,
        bytes memory signature
    ) external checkSignature(cid, customNonce, hash, signature) {
        require(isMintLive, "Not live");

        usedNonces[customNonce] = true;

        // start minting
        customUrl[_nextTokenId()] = cid;
        emit MintLog(msg.sender, _nextTokenId());
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
            systemAddress == hash.toEthSignedMessageHash().recover(signature);
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

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseTokenURI = _baseURI;
    }

    function setSystemAddress(address _systemAddress) external onlyOwner {
        systemAddress = _systemAddress;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken(); //_baseURI();

        string memory end = bytes(baseTokenURI).length != 0
            ? string(abi.encodePacked(baseTokenURI, customUrl[tokenId]))
            : "";
        return end;
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
            for (uint256 i; i < _nextTokenId()-1; i++) {
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
