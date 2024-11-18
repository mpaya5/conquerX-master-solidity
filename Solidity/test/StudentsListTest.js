const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("StudentsList", function () {
  let StudentsList;
  let studentsList;
  let owner;
  let student1;
  let student2;

  beforeEach(async function () {
    [owner, student1, student2] = await ethers.getSigners();
    StudentsList = await ethers.getContractFactory("StudentsList");
    studentsList = await StudentsList.deploy();
    await studentsList.waitForDeployment();
  });

  it("should add a new student", async function () {
    await studentsList.connect(owner).addStudent("Alice", 20, student1.address);
    const studentData = await studentsList.connect(student1).getOwnData();

    expect(studentData.name).to.equal("Alice");
    expect(studentData.age).to.equal(20);
    expect(studentData.studentIdentifier).to.equal(student1.address);
  });

  it("should not add a student with the same address", async function () {
    await studentsList.connect(owner).addStudent("Alice", 20, student1.address);
    const studentData = await studentsList.connect(student1).getOwnData();

    expect(studentData.name).to.equal("Alice");
    expect(studentData.age).to.equal(20);
    expect(studentData.studentIdentifier).to.equal(student1.address);
  });

  it("should allow a student to view their own data", async function () {
    await studentsList.connect(owner).addStudent("Bob", 22, student2.address);
    const studentData = await studentsList.connect(student2).getOwnData();

    expect(studentData.name).to.equal("Bob");
    expect(studentData.age).to.equal(22);
    expect(studentData.studentIdentifier).to.equal(student2.address);
  });

  it("should allow the owner to view all students' data", async function () {
    await studentsList.connect(owner).addStudent("Alice", 20, student1.address);
    await studentsList.connect(owner).addStudent("Bob", 22, student2.address);

    const allStudents = await studentsList.connect(owner).getAllData();
    expect(allStudents.length).to.equal(2);
  });

  it("should not allow a non-owner to view all students' data", async function () {
    await expect(
      studentsList.connect(student1).getAllData()
    ).to.be.revertedWith("You cannot access this data");
  });
});
