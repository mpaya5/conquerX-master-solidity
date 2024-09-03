// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.14;

/* 
Simulate an Hotel Room functionality.The contract need to have:
1.  The contract should have an owner who will receive payments when the room is occupied.
2.  The contract should define a structure that specifies the two possible states of the hotel room: occupied or vacant.
3.  When the contract is deployed, the initial state of the room should be vacant.
4.  The contract should have a function that allows the room to be occupied and paid for. The price should be 1 ether, 
    and it should be transferred directly to the owner of the contract. If the transaction is successful, an event should 
    be emitted with the appropriate information.
5.  To be able to pay for and occupy the room, the room must be in a vacant state.
*/

import "@openzeppelin/contracts/access/Ownable.sol";

contract HotelRoom is Ownable{
    // Define room Status
    enum roomStatus {OCCUPIED, VACANT}

    // Structure to represent the room
    struct Room {
        uint32 id;
        uint256 price;
        roomStatus status;
    }

    // Define the room
    Room public room;

    // Define events
    event RoomOccupied(address _guest);
    event WithdrawDone(uint256 _amount);

    // Constructor to initialize the room
    constructor () {
        setRoom();
    }

    /**
     * @dev Sets the room status to VACANT and defines the room's characteristics.
     */
    function setRoom () private {
        room = Room({
            id: 1,
            price: 1*10**18, // Price in wei (1 ether)
            status: roomStatus.VACANT
        });
    }

    /**
     * @dev Allows the owner to withdraw the balance of the contract.
     * 
     * Requirements:
     * - The contract must have a positive balance.
     */
    function withdrawBalance () internal {
        uint256 balanceContract = address(this).balance;
        require(balanceContract > 0, "No balance to withdraw");

        payable(owner()).transfer(balanceContract);

        emit WithdrawDone(balanceContract);
    }

    /**
     * @dev Allows a user to occupy the room by paying the required price.
     *
     * Requirements:
     * - The user must send enough Ether to cover the total cost.
     * - The room must be VACANT to be occupied.
     */
    function scheduleRoom () external payable {
        require (msg.value >= room.price, "Insufficient value sent");
        require (room.status == roomStatus.VACANT);

        room.status = roomStatus.OCCUPIED;

        emit RoomOccupied(msg.sender);

        if (msg.value > room.price) {
            payable(msg.sender).transfer(msg.value - room.price);
        }

        withdrawBalance();
    }
}