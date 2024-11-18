// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import {IERC721Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";


/**
 * @title ERC721 Standard Non-Fungible Token Implementation
 * @dev Implements the ERC721 standard, including metadata and safe transfer functions.
 */
abstract contract OwnERC721 is ERC165, IERC721, IERC721Metadata, Context, IERC721Errors {
    using Address for address;
    using Strings for uint256;

    // NFT's collection name and symbol
    string private _name;
    string private _symbol;

    mapping(uint256=>address) private _owners; // Mapping from token ID to owner address
    mapping(address=>uint256) private _balances; // Mapping owner address to token count
    mapping(uint256=>address) private _tokenApprovals; // Mapping from token ID to approved address
    mapping(address=>mapping(address=>bool)) private _operatorApprovals; // Mapping from owner to operator approvals

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     * @param name_ The name of the token collection.
     * @param symbol_ The symbol of the token collection.
     */
    constructor (string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     * Checks whether the contract supports an interface (ERC165).
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return 
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);

    }

    /**
     * @dev See {IERC721-balanceOf}.
     * Returns the balance (number of tokens) of a given address.
     */
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require (owner != address(0), "ERC721: address zero is not a valid owner");
        return _balances[owner];
    }

    /**
     * @dev See {IERC721-ownerOf}.
     * Returns the owner of the specified token ID.
     */
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _ownerOf(tokenId);
        require (owner != address(0), "ERC721: Invalid tokenId");

        return owner;
    }

    /**
     * @dev See {IERC721Metadata-name}.
     * Returns the name of the token collection.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    } 

    /**
     * @dev See {IERC721Metadata-symbol}.
     * Returns the symbol of the token collection.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev See {IERC721-approve}.
     * Approves another address to transfer the given token ID.
     */
    function approve (address to, uint256 tokenId) public virtual override {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(
            _msgSender() == owner || isApprovedForAll(owner, _msgSender())
            , "ERC721: approve caller is not token owner or approved for all"
        );

        _approve(to, tokenId);
    }

    /**
     * @dev See {IERC721-getApproved}.
     * Returns the address approved for the given token ID.
     */
    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        _requiredMinted(tokenId);
        return _tokenApprovals[tokenId];
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     * Approves or removes `operator` as an operator for the caller.
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     * Returns if the `operator` is allowed to manage all assets of `owner`.
     */
    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev See {IERC721-transferFrom}.
     * Transfers the ownership of a given token ID to another address.
     */
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");

        _transfer(from, to, tokenId);
    }

     /**
     * @dev See {IERC721-safeTransferFrom}.
     * Safely transfers the ownership of a given token ID to another address.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     * Safely transfers the ownership of a given token ID to another address with additional data.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        _safeTransfer(from, to, tokenId, data);
    }

    /**
     * @dev Internal function to safely transfer a token.
     * @param from The current owner of the token.
     * @param to The new owner.
     * @param tokenId The token ID to transfer.
     * @param data Additional data to pass to the receiver contract.
     */
    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data) internal virtual {
        _transfer(from, to, tokenId);
        require(_checkOnErc721Received(from, to, tokenId, data), "ERC721: transfer to non ERC721Receiver implementer");
    }


    function _ownerOf(uint256 tokenId) internal view virtual returns (address) {
        return _owners[tokenId];
    }

    /**
     * @dev Internal function to check if a token exists.
     * @param tokenId The token ID to check for.
     * @return True if the token exists, otherwise false.
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _ownerOf(tokenId)!= address(0);
    }

    /**
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     * @param spender The address to check.
     * @param tokenId The token ID to check for.
     * @return True if the spender is the owner or is approved, otherwise false.
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        address owner = ownerOf(tokenId);

        return 
            spender == owner ||
            isApprovedForAll(owner, spender) ||
            getApproved(tokenId) == spender;
    }

    function _safeMint(address to, uint256 tokenId) internal virtual {
        _safeMint(to, tokenId, "");
    }

    function _safeMint(address to, uint256 tokenId, bytes memory data) internal virtual {
        _mint(to, tokenId);

        require(_checkOnErc721Received(address(0), to, tokenId, data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /**
     * @dev Internal function to mint a new token.
     * @param to The address to receive the new token.
     * @param tokenId The token ID of the new token.
     */
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId, 1);
        require(!_exists(tokenId), "ERC721: token already minted");

        unchecked {
            _balances[to]+=1;
        }

        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);

        _afterTokenTransfer(address(0), to, tokenId, 1);
    }

    /**
     * @dev Internal function to burn a token.
     * @param tokenId The token ID to burn.
     */
    function _burn(uint256 tokenId) internal virtual {
        address owner = ownerOf(tokenId);

        _beforeTokenTransfer(owner, address(0), tokenId, 1);
        owner = ownerOf(tokenId);

        delete _tokenApprovals[tokenId];

        unchecked {
            _balances[owner] -= 1;
        }

        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);
    }

    /**
     * @dev Internal function to Transfer the token.
     * @param from The address that will send the token.
     * @param to The addres that will receive the token.
     * @param tokenId The token Id to transfer.
     */
    function _transfer(address from, address to, uint256 tokenId) internal virtual {
        require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
        require(to != address(0), "ERC721: transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId, 1);
        require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");

        delete _tokenApprovals[tokenId];

        unchecked {
            _balances[from] -= 1;
            _balances[to] += 1;
        }

        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);

        _afterTokenTransfer(from, to, tokenId, 1);
    }

    /**
     * @dev Internal function to approve a token transfer.
     * @param to The address to be approved.
     * @param tokenId The token ID to approve.
     */
    function _approve(address to, uint256 tokenId) internal virtual {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

    /**
     * @dev Internal function to set approval for all tokens of a given owner.
     * @param owner The address of the owner.
     * @param operator The address to be approved or disapproved.
     * @param approved True to approve, false to disapprove.
     */
    function _setApprovalForAll(address owner, address operator, bool approved) internal virtual {
        require(owner != operator, "ERC721: approved to caller");

        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    /**
     * @dev Internal function to check whether a token has been minted.
     * @param tokenId The token ID to check.
     */
    function _requiredMinted(uint256 tokenId) internal view virtual {
        require(_exists(tokenId), "ERC721: invalid token ID");
    }

    /**
     * @dev Internal function to check if a contract implements `onERC721Received`.
     * @param from The current owner of the token.
     * @param to The new owner.
     * @param tokenId The token ID being transferred.
     * @param data Additional data to pass to the receiver contract.
     * @return success if the contract implements `onERC721Received`, otherwise false.
     */
     function _checkOnErc721Received(address from, address to, uint256 tokenId, bytes memory data) private returns (bool success) {
        if (to.code.length > 0) {
            try IERC721Receiver(to).onERC721Received(from, from, tokenId, data) returns (bytes4 retval) {
                if (retval != IERC721Receiver.onERC721Received.selector) {
                    // Token rejected
                    revert IERC721Errors.ERC721InvalidReceiver(to);
                }
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    // non-IERC721Receiver implementer
                    revert IERC721Errors.ERC721InvalidReceiver(to);
                } else {
                    assembly ("memory-safe") {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        }
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 amount) internal virtual { }

    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256 amount) internal virtual { }


}