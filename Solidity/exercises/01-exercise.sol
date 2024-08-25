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

    // Create a new Student
    function addStudent (string memory _name, uint8 _age) public returns (bool success)
    {
        if (!students[msg.sender].exist) {
            students[msg.sender] = Student(msg.sender, _name, _age, true);
            allStudents.push(students[msg.sender]);
            return true;
        }
    }

    // Get all the Student Data (just if the ones who execute the function is a student)
    function getOwnData() public view returns (Student memory) {
        return students[msg.sender];
    }
    
    // Get all the students data
    function getAllData() public view returns (Student[] memory) {
        return allStudents;
    }
}