// SPDX-License-Identifier: GPL-3.0

/*
## Example Exercise

**Build a smart contract simulating a Bank**

### Variables

- A list where we save the balance of an account with address and amount.

### Functions

- A function to add balance to their own account.
- A function to return their own balance.
- A function to transfer balance between accounts (address): 
    - Inside function to transfer balance with 3 parámeters: the receiver, the sender, the amount.
*/

pragma solidity >=0.7.0;

contract Bank {

    // Structure representing a bank account
    struct BankAccount {
        address owner;       // The owner of the bank account
        uint256 balance;     // The balance of the bank account in wei
    }

    // Mapping to store bank accounts by address
    mapping (address => BankAccount) private bank_accounts;

    // Event to log transfers between accounts
    event Transfer(address _from, address _to, uint _amount);

    /**
     * @dev Adds balance to the caller's account.
     * @param _amount The amount to add to the balance.
     *
     * Requirements:
     * - The amount is added directly to the caller's account.
     */
    function addBalance(uint8 _amount) public {
        bank_accounts[msg.sender].balance += _amount;
    }

    /**
     * @dev Returns the balance of the caller's account.
     * @return The balance of the caller's account.
     */
    function getBalance() public view returns (uint256) {
        return bank_accounts[msg.sender].balance;
    }

    /**
     * @dev Private function to handle balance transfers between accounts.
     * @param _sender The address of the account sending the balance.
     * @param _receiver The address of the account receiving the balance.
     * @param _amount The amount to transfer.
     *
     * Requirements:
     * - The sender must have sufficient balance.
     * - If the sender has insufficient balance, the function returns without making the transfer.
     */
    function transferBalancePrivate(address _sender, address _receiver, uint256 _amount) private {
        if (bank_accounts[_sender].balance < _amount) {
            return; // Abort the transfer if the sender doesn't have enough balance
        } else {
            bank_accounts[_sender].balance -= _amount;
            bank_accounts[_receiver].balance += _amount;
            emit Transfer(_sender, _receiver, _amount);
        }
    }

    /**
     * @dev Public function to initiate a balance transfer.
     * @param _receiver The address of the account receiving the balance.
     * @param _amount The amount to transfer.
     *
     * Requirements:
     * - Calls the internal function `transferBalancePrivate` to execute the transfer.
     */
    function transferBalance(address _receiver, uint256 _amount) public {
        transferBalancePrivate(msg.sender, _receiver, _amount);
    }
}