//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.14;

/*
    msg.data EMPTY?
    A. NO: Calls fallback()
    B. YES: Is there a receive() function?
        B.1. YES: Calls receive() function
        B.2. NO: Calls falback() function
*/

contract ReceiveFallback{
    // Events
    event info (string _function, address _sender, uint _amount, bytes _data);

    fallback() external payable {
        emit info("fallback", msg.sender, msg.value, msg.data);
    }

    receive() external payable{
        emit info("receive", msg.sender, msg.value, "");
    }
}