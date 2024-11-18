// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "./ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ConquerToken
 * @dev ERC20 token with AccessControl for minting and burning functionalities.
 * Inherits from ERC20 for basic token functionality and AccessControl to manage roles.
 */
contract ConquerToken is ERC20, AccessControl {
    // Role identifier for users allowed to mint tokens
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    // Role identifier for users allowed to burn tokens
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    /**
     * @dev Grants MINTER_ROLE and BURNER_ROLE to the account that deploys the contract.
     */
    constructor() ERC20("Conquer", "CNQT") {
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }

    /**
     * @dev Allows users with the MINTER_ROLE to mint tokens.
     * Mints 1000 tokens to the caller's address.
     * Requirements:
     * - The caller must have the MINTER_ROLE.
     */
    function mintTokens() public onlyRole(MINTER_ROLE) {
        _mint(msg.sender, 1000 * 10 ** 18);
    }

    /**
     * @dev Allows users with the BURNER_ROLE to burn tokens.
     * Burns 1000 tokens from the caller's balance.
     * Requirements:
     * - The caller must have the BURNER_ROLE.
     */
    function burnTokens() public onlyRole(BURNER_ROLE) {
        _burn(msg.sender, 1000 * 10 ** 14);
    }
}
