// SPDX-License-Identifier: GPL-3.0

/*
## Example Exercise

**Build a smart contract where students can register on a list:**

### Variables

- A `Student` structure, with its own characteristics.
- A list where students can register using their Ethereum address (`address`).

### Functions

- A function to register on the list.
- A function for each student to view their own data.
- A function to view the information of all students.
*/

pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

contract StudentsList {
    address private owner;
    // Represent a unique Student
    struct Student {
        address studentIdentifier;
        string name;
        uint8 age;
        bool exist;
    }
    // Each Student is associated to an address
    mapping (address => Student) private students;
    Student [] allStudents;

    constructor() {
        owner = msg.sender;
    }

    // Create a modifier
    modifier onlyOwner () {
        require(msg.sender == owner, "You cannot access to this data");
        _;
    }

    // Create a new Student
    function addStudent (string memory _name, uint8 _age, address _studentAddress) public returns (bool success)
    {
        require(bytes(_name).length != 0, "Error: Empty Name"); // Check name is not empty
        require(_age > 0, "Error: Age cannot be negative");
        if (!students[_studentAddress].exist) {
            students[_studentAddress] = Student(_studentAddress, _name, _age, true);
            allStudents.push(students[_studentAddress]);
            return true;
        }
    }

    // Get all the Student Data (just if the ones who execute the function is a student)
    function getOwnData() public view returns (Student memory) {
        return students[msg.sender];
    }
    
    // Get all the students data
    function getAllData() public view onlyOwner returns (Student[] memory) {
        return allStudents;
    }
}