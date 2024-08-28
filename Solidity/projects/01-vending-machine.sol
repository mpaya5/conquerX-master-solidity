//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.14;

/* 
Simulate a Vending Machine functionality:
1) Just the propietary can add new products
2) Just the propietary can restock products
3) Just the propietary can check the balance of the Vending Machine
4) Each person with balance can buy products
5) Just the propietary can send the balance of the vending machine to their own account

*/

contract VendingMachine {
    address payable private owner;

    // Create the Struct of the snack
    struct Snack {
        uint32 id;
        string name;
        uint32 quantity;
        uint8 price;
        bool exists;
    }

    Snack [] stock;
    uint32 totalSnacks;
    mapping (string => Snack) private snacks;
    // Initialize the values
    constructor () {
        owner = payable(msg.sender);
        totalSnacks = 0;
    }

    modifier onlyOwner () {
        require(msg.sender == owner, "Just the owner can execute this function.");
        _;
    }

    function getAllSnacks () public view returns (Snack[] memory _stock) {
        return stock;
    }

    function restockProduct (string memory _name, uint32 _quantity) public onlyOwner {
        if (snacks[_name].exists) {
            snacks[_name].quantity += _quantity;
        }
    }

    function addProduct (string memory _name, uint32 _quantity, uint8 _price) public onlyOwner {
        if (snacks[_name].exists) {
            restockProduct(_name, _quantity);
        } else {
            snacks[_name] = Snack(totalSnacks, _name, _quantity, _price, true);
            stock.push(snacks[_name]);
            totalSnacks++;
        }
    }


}