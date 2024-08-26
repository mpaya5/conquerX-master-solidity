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

    struct BankAccount {
        address owner;
        uint256 balance;
    }

    mapping (address => BankAccount) private bank_accounts;

    // Create an event
    event Transfer (address _from, address _to, uint _amount);

    // Add balance to the caller's account
    function addBalance (uint8 _amount) public {
        bank_accounts[msg.sender].balance += _amount;
    }

    // Get the balance of the caller's account
    function getBalance() public view returns (uint256) {
        return bank_accounts[msg.sender].balance;
    }

    // Private function to handle balance transfer between accounts
    function transferBalancePrivate(address _sender, address _receiver, uint256 _amount) private {
        if (bank_accounts[_sender].balance < _amount) {
            return;
        } else {
            bank_accounts[_sender].balance -= _amount;
            bank_accounts[_receiver].balance += _amount;
            emit Transfer(_sender, _receiver, _amount);
        }
    }

    // Public function to initiate a balance transfer
    function transferBalance(address _receiver, uint256 _amount) public {
        transferBalancePrivate(msg.sender, _receiver, _amount);
    }
}
