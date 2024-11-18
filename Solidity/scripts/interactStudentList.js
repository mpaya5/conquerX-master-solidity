const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("Starting StudentsList interaction simulation...\n");

    // Get signers
    const [owner, student1, student2] = await ethers.getSigners();
    console.log("Owner address:", owner.address);
    console.log("Student 1 address:", student1.address);
    console.log("Student 2 address:", student2.address);

    // Deploy contract
    const StudentsList = await ethers.getContractFactory("StudentsList");
    const studentsList = await StudentsList.deploy();
    await studentsList.waitForDeployment();
    console.log("\nStudentsList deployed to:", await studentsList.getAddress());

    // Add first student
    console.log("\nAdding first student...");
    const tx1 = await studentsList.connect(owner).addStudent(
      "Alice",
      20,
      student1.address
    );
    await tx1.wait();
    console.log("First student (Alice) added successfully");

    // Add second student
    console.log("\nAdding second student...");
    const tx2 = await studentsList.connect(owner).addStudent(
      "Bob",
      22,
      student2.address
    );
    await tx2.wait();
    console.log("Second student (Bob) added successfully");

    // Get data for student 1
    console.log("\nGetting data for student 1...");
    const student1Data = await studentsList.connect(student1).getOwnData();
    console.log("Student 1 data:");
    displayStudentData(student1Data);

    // Get data for student 2
    console.log("\nGetting data for student 2...");
    const student2Data = await studentsList.connect(student2).getOwnData();
    console.log("Student 2 data:");
    displayStudentData(student2Data);

    // Get all students' data (owner only)
    console.log("\nGetting all students' data (owner only)...");
    const allStudents = await studentsList.connect(owner).getAllData();
    console.log("All students:");
    allStudents.forEach((student, index) => {
      console.log(`\nStudent ${index + 1}:`);
      displayStudentData(student);
    });

    // Try to add a student with invalid data
    console.log("\nTrying to add student with empty name...");
    try {
      await studentsList.connect(owner).addStudent("", 20, student1.address);
    } catch (error) {
      console.log("Error caught successfully:", error.message);
    }

    // Try to access all data as non-owner
    console.log("\nTrying to access all data as non-owner...");
    try {
      await studentsList.connect(student1).getAllData();
    } catch (error) {
      console.log("Error caught successfully:", error.message);
    }

    console.log("\nSimulation completed successfully!");

  } catch (error) {
    console.error("\nError in simulation:", error);
    process.exitCode = 1;
  }
}

// Helper function to display student data
function displayStudentData(student) {
  console.log(`  Address: ${student.studentIdentifier}`);
  console.log(`  Name: ${student.name}`);
  console.log(`  Age: ${student.age}`);
  console.log(`  Exists: ${student.exist}`);
}

// Execute simulation
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
