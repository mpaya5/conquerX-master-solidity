// SPDX-License-Identifier: GPL-3.0
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
    // Address of the vending machine owner
    address payable private owner;

    // Structure to represent a snack item
    struct Snack {
        uint32 id;          // Unique identifier for the snack
        string name;        // Name of the snack
        uint32 quantity;    // Quantity available in the vending machine
        uint256 price;      // Price of the snack in wei
    }

    // Array to store all snacks available in the vending machine
    Snack[] public stock;

    // Counter to keep track of the total number of snacks added
    uint32 public totalSnacks;

    // Events to log various actions
    event NewSnackAdded(string _name, uint256 _price);
    event SnackRestored(string _name, uint32 _quantity);
    event WithdrawDone(uint256 _balance);
    event SnackSold(string _name, uint32 _amount, uint256 _price);
    event LogValueReceived(uint256 value);
    event LogTotalCost(uint256 totalCost);

    // Constructor to initialize the owner as the contract deployer
    constructor () {
        owner = payable(msg.sender);
        totalSnacks = 0;
    }

    // Modifier to restrict certain functions to only the owner
    modifier onlyOwner () {
        require(msg.sender == owner, "Just the owner can execute this function.");
        _;
    }

    /**
     * @dev Returns all snacks available in the vending machine.
     * @return _stock An array of all snacks in the vending machine.
     */
    function getAllSnacks () public view returns (Snack[] memory _stock) {
        return stock;
    }

    /**
     * @dev Adds a new snack to the vending machine.
     * @param _name Name of the snack.
     * @param _quantity Quantity of the snack to add.
     * @param _price Price of the snack in ether (multiplied by 10^18).
     * 
     * Requirements:
     * - Only the owner can add a snack.
     * - The name cannot be empty.
     * - The price must be greater than 0.
     * - The quantity must be greater than 0.
     * - The snack should not already exist.
     */
    function addSnack (string memory _name, uint32 _quantity, uint256 _price) external onlyOwner {
        require(bytes(_name).length != 0, "Null name");
        require(_price > 0, "Price cannot be 0 or less than 0");
        require(_quantity > 0, "Quantity cannot be 0 or less than 0");

        for (uint8 i = 0; i < stock.length; i++) {
            require(!compareStrings(_name, stock[i].name), "Snack already exists");
        }

        uint256 adjustedPrice = _price * 10**18; // Adjust the price to wei
        stock.push(Snack(totalSnacks, _name, _quantity, adjustedPrice));
        totalSnacks++;

        emit NewSnackAdded(_name, adjustedPrice);
    }

    /**
     * @dev Restocks an existing snack in the vending machine.
     * @param _id ID of the snack to restock.
     * @param _quantity Quantity to add to the existing stock.
     * 
     * Requirements:
     * - Only the owner can restock a snack.
     * - The quantity must be greater than 0.
     * - The snack ID must be valid.
     */
    function restockSnack (uint32 _id, uint32 _quantity) external onlyOwner {
        require(_quantity > 0, "Quantity cannot be 0 or less than 0");
        require(_id < stock.length, "The Snack does not exist");

        stock[_id].quantity += _quantity;

        emit SnackRestored(stock[_id].name, stock[_id].quantity);
    }

    /**
     * @dev Returns the current balance of the vending machine.
     * @return _balance The balance of the vending machine in wei.
     * 
     * Requirements:
     * - Only the owner can check the balance.
     */
    function getMachineBalance () external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Withdraws the entire balance of the vending machine to the owner's address.
     * 
     * Requirements:
     * - Only the owner can withdraw the balance.
     * - There must be a balance to withdraw.
     */
    function withdrawBalance () external onlyOwner {
        uint256 balance_machine = address(this).balance;
        require(balance_machine > 0, "No balance to withdraw");
        owner.transfer(balance_machine);

        emit WithdrawDone(balance_machine);
    }

    /**
     * @dev Allows a user to purchase a snack from the vending machine.
     * @param _id ID of the snack to purchase.
     * @param _amount Quantity of the snack to purchase.
     * 
     * Requirements:
     * - The snack ID must be valid.
     * - The quantity must be greater than 0.
     * - There must be sufficient quantity of the snack in stock.
     * - The user must send enough Ether to cover the total cost.
     */
    function buySnack (uint32 _id, uint32 _amount) external payable {
        require (_amount > 0, "Amount cannot be 0 or less than 0");
        require (_id < stock.length, "The Snack does not exist");
        require(stock[_id].quantity >= _amount, "There is not enough quantity in the vending machine");
        
        uint256 totalCost = _amount * stock[_id].price;
        require(msg.value >= totalCost, "Insufficient value sent");

        emit LogValueReceived(msg.value);
        emit LogTotalCost(totalCost);

        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);  // Return the excess
        }

        stock[_id].quantity -= _amount;

        emit SnackSold(stock[_id].name, _amount, totalCost);
    }

    /**
     * @dev Compares two strings to check if they are equal.
     * @param a The first string to compare.
     * @param b The second string to compare.
     * @return bool Returns true if the strings are equal, otherwise false.
     */
    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b)));
    }
}
