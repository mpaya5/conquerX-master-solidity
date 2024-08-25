//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.14;

contract Visibilidad {
    uint public x = 15;
    uint y = 10; //Internal
    uint private z = 30;

    function getY () public view returns (uint) {
        return getPrivateY();
    }

    function getPrivateY () private view returns (uint) {
        return y;
    }

    function getX() internal view returns (uint) {
        return x;
    }

    function getExternalX () external view returns (uint) {
        return x;
    }

    function getSuma (uint a, uint b) public pure returns (uint) {
        return a+b;
    }
}

contract A is Visibilidad {
    uint public xx = getX();
}

contract B {
    Visibilidad contract1 = new Visibilidad();
    uint public var1 = contract1.getY();
    uint public var2 = contract1.getExternalX();
    uint public var3 = contract1.getSuma(var1, var2);
}