// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

/**
 * @title IERC20
 * @dev Interface for interacting with ERC20 tokens in the TokenSale contract.
 */
interface IERC20 {
    function transfer(address to, uint256 amount) external;
    function decimals() external view returns (uint);
}

/**
 * @title TokenSale
 * @dev This contract allows users to purchase tokens by sending Ether.
 * The token price is set to 1 Ether per unit (adjusted for token decimals).
 */
contract TokenSale {
    // Price per token in Wei (1 Ether)
    uint256 tokenPrice = 1 ether;

    // Reference to the ERC20 token being sold
    IERC20 token;

    /**
     * @dev Sets the token that will be sold in the contract.
     * @param _token The address of the ERC20 token contract.
     */
    constructor(address _token) {
        token = IERC20(_token);
    }

    /**
     * @dev Allows users to purchase tokens by sending Ether.
     * The number of tokens received is calculated based on the amount of Ether sent.
     * Requirements:
     * - The amount of Ether sent must be equal to or greater than the token price.
     */
    function purchase() public payable {
        require(msg.value >= tokenPrice, "Not enough money");

        // Calculate the number of tokens to transfer based on the amount of Ether sent
        uint256 tokensToTransfer = msg.value / tokenPrice;

        // Transfer the calculated amount of tokens to the buyer
        token.transfer(msg.sender, tokensToTransfer * 10 ** token.decimals());
    }
}
