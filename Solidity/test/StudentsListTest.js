const StudentsList = artifacts.require("StudentsList");

contract("StudentsList", (accounts) => {
  const owner = accounts[0];
  const student1 = accounts[1];
  const student2 = accounts[2];

  it("should add a new student", async () => {
    const instance = await StudentsList.deployed();
    const success = await instance.addStudent("Alice", 20, student1, { from: owner });

    assert.isTrue(success, "Student was not added successfully");

    const studentData = await instance.getOwnData({ from: student1 });

    assert.equal(studentData.name, "Alice", "Student name mismatch");
    assert.equal(studentData.age, 20, "Student age mismatch");
    assert.equal(studentData.studentIdentifier, student1, "Student address mismatch");
  });

  it("should not add a student with the same address", async () => {
    const instance = await StudentsList.deployed();
    const success = await instance.addStudent("Alice", 20, student1, { from: owner });

    assert.isFalse(success, "Duplicate student was added");
  });

  it("should allow a student to view their own data", async () => {
    const instance = await StudentsList.deployed();
    await instance.addStudent("Bob", 22, student2, { from: owner });

    const studentData = await instance.getOwnData({ from: student2 });

    assert.equal(studentData.name, "Bob", "Student name mismatch");
    assert.equal(studentData.age, 22, "Student age mismatch");
    assert.equal(studentData.studentIdentifier, student2, "Student address mismatch");
  });

  it("should allow the owner to view all students' data", async () => {
    const instance = await StudentsList.deployed();

    const allStudents = await instance.getAllData({ from: owner });

    assert.equal(allStudents.length, 2, "There should be two students registered");
  });

  it("should not allow a non-owner to view all students' data", async () => {
    const instance = await StudentsList.deployed();
    try {
      await instance.getAllData({ from: student1 });
      
      assert.fail("Non-owner was able to view all students' data");
    } catch (error) {
      assert(error.message.includes("You cannot access this data"), "Incorrect error message");
    }
  });
});
