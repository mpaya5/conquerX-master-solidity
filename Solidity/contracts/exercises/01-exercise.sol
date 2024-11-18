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
    // Address of the contract owner
    address private owner;

    // Structure representing a unique student
    struct Student {
        address studentIdentifier;  // Ethereum address of the student
        string name;                // Name of the student
        uint8 age;                  // Age of the student
        bool exist;                 // Indicates if the student exists
    }

    // Mapping of student address to Student structure
    mapping (address => Student) private students;

    // Array to store all registered students
    Student[] allStudents;

    // Constructor to initialize the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict access to only the owner
    modifier onlyOwner () {
        require(msg.sender == owner, "You cannot access this data");
        _;
    }

    /**
     * @dev Registers a new student.
     * @param _name Name of the student.
     * @param _age Age of the student.
     * @param _studentAddress Ethereum address of the student.
     * @return success Returns true if the student was successfully registered.
     *
     * Requirements:
     * - The student's name cannot be empty.
     * - The student's age must be greater than 0.
     * - The student's address must not already be registered.
     */
    function addStudent (string memory _name, uint8 _age, address _studentAddress) public returns (bool success) {
        require(bytes(_name).length != 0, "Error: Empty Name"); // Check that the name is not empty
        require(_age > 0, "Error: Age cannot be negative"); // Check that the age is positive
        if (!students[_studentAddress].exist) { // Ensure the student is not already registered
            students[_studentAddress] = Student(_studentAddress, _name, _age, true);
            allStudents.push(students[_studentAddress]); // Add the student to the list
            return true;
        }
        return false; // Return false if the student is already registered
    }

    /**
     * @dev Retrieves the data of the student who calls this function.
     * @return The student's data (name, age, and address).
     */
    function getOwnData() public view returns (Student memory) {
        return students[msg.sender];
    }

    /**
     * @dev Retrieves the data of all registered students. Only the owner can call this function.
     * @return An array of all students.
     */
    function getAllData() public view onlyOwner returns (Student[] memory) {
        return allStudents;
    }
}