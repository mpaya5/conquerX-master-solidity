const StudentsList = artifacts.require("StudentsList");

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const student1 = accounts[1];
    const student2 = accounts[2];

    const instance = await StudentsList.deployed();

    console.log("Adding first student...");
    await instance.addStudent("Alice", 20, student1, { from: owner });
    console.log("First student added.");

    console.log("Adding second student...");
    await instance.addStudent("Bob", 22, student2, { from: owner });
    console.log("Second student added.");

    console.log("Getting data for student 1...");
    let studentData = await instance.getOwnData({ from: student1 });
    console.log("Student 1 data:", studentData);

    console.log("Getting data for student 2...");
    studentData = await instance.getOwnData({ from: student2 });
    console.log("Student 2 data:", studentData);

    console.log("Getting all students' data (owner only)...");
    const allStudents = await instance.getAllData({ from: owner });
    console.log("All students:", allStudents);

    callback();
  } catch (error) {
    console.error("Error during interaction with StudentsList contract:", error);
    callback(error);
  }
};
