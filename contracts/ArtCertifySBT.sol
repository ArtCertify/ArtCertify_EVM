// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ArtCertify SBT: ERC-721 + ERC-5192 (soulbound).
 * - mint(to, tokenURI) and setTokenURI(tokenId, uri) restricted to owner.
 * - Tokens are locked (non-transferable).
 */
contract ArtCertifySBT is ERC721, Ownable {
    error TokenLocked();

    /// @dev ERC-5192 interface id: locked(uint256)
    bytes4 public constant LOCKED_INTERFACE_ID = 0xb45a3c0e;

    mapping(uint256 => string) private _tokenURIs;

    constructor(address initialOwner) ERC721("ArtCertify Certificate", "ARTCRT") Ownable(initialOwner) {}

    /// @dev Anyone can mint for themselves (certification flow). Owner can still mint for others if needed.
    function mint(address to, string calldata tokenURI_) external returns (uint256 tokenId) {
        if (to != msg.sender && msg.sender != owner()) revert();
        tokenId = _nextId;
        _nextId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = tokenURI_;
        return tokenId;
    }

    /// @dev Owner of the contract or owner of the token can update URI.
    function setTokenURI(uint256 tokenId, string calldata tokenURI_) external {
        address tokenOwner = ownerOf(tokenId);
        if (msg.sender != tokenOwner && msg.sender != owner()) revert();
        _tokenURIs[tokenId] = tokenURI_;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        ownerOf(tokenId); // reverts if not minted
        return _tokenURIs[tokenId];
    }

    /// @dev ERC-5192: soulbound — always locked
    function locked(uint256) external pure returns (bool) {
        return true;
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == LOCKED_INTERFACE_ID || super.supportsInterface(interfaceId);
    }

    uint256 private _nextId = 1;

    function totalSupply() public view returns (uint256) {
        return _nextId - 1;
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) revert TokenLocked();
        return super._update(to, tokenId, auth);
    }
}
