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

}