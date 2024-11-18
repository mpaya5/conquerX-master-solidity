const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("VendingMachine", function () {
  let VendingMachine;
  let vendingMachine;
  let owner;
  let buyer;

  beforeEach(async function () {
    [owner, buyer] = await ethers.getSigners();
    
    VendingMachine = await ethers.getContractFactory("VendingMachine");
    vendingMachine = await VendingMachine.deploy();
    await vendingMachine.waitForDeployment();
  });

  it("should add a new snack", async function () {
    await vendingMachine.connect(owner).addSnack("Chips", 10, 1);
    const snacks = await vendingMachine.getAllSnacks();
    
    expect(snacks.length).to.equal(1);
    expect(snacks[0].name).to.equal("Chips");
    expect(snacks[0].quantity).to.equal(10);
    expect(snacks[0].price).to.equal(ethers.parseEther("1"));
  });

  it("should not allow non-owner to add snacks", async function () {
    await expect(
      vendingMachine.connect(buyer).addSnack("Chips", 10, 1)
    ).to.be.revertedWith("You cannot access this data");
  });

  it("should restock an existing snack", async function () {
    await vendingMachine.connect(owner).addSnack("Chips", 10, 1);
    await vendingMachine.connect(owner).restockSnack(0, 5);
    
    const snacks = await vendingMachine.getAllSnacks();
    expect(snacks[0].quantity).to.equal(15);
  });

  it("should allow buying snacks", async function () {
    await vendingMachine.connect(owner).addSnack("Chips", 10, 1);
    
    await vendingMachine.connect(buyer).buySnack(0, 2, {
      value: ethers.parseEther("2")
    });

    const snacks = await vendingMachine.getAllSnacks();
    expect(snacks[0].quantity).to.equal(8);
  });

  it("should not allow buying with insufficient funds", async function () {
    await vendingMachine.connect(owner).addSnack("Chips", 10, 1);
    
    await expect(
      vendingMachine.connect(buyer).buySnack(0, 2, {
        value: ethers.parseEther("0.5")
      })
    ).to.be.revertedWith("Insufficient value sent");
  });

  it("should allow owner to withdraw balance", async function () {
    await vendingMachine.connect(owner).addSnack("Chips", 10, 1);
    
    await vendingMachine.connect(buyer).buySnack(0, 2, {
      value: ethers.parseEther("2")
    });

    const initialBalance = await ethers.provider.getBalance(owner.address);
    
    await vendingMachine.connect(owner).withdrawBalance();
    
    const finalBalance = await ethers.provider.getBalance(owner.address);
    expect(finalBalance).to.be.gt(initialBalance);
  });

  it("should not allow non-owner to withdraw balance", async function () {
    await expect(
      vendingMachine.connect(buyer).withdrawBalance()
    ).to.be.revertedWith("You cannot access this data");
  });

  it("should not add snack with empty name", async function () {
    await expect(
      vendingMachine.connect(owner).addSnack("", 10, 1)
    ).to.be.revertedWith("Null name");
  });

  it("should not add snack with zero quantity", async function () {
    await expect(
      vendingMachine.connect(owner).addSnack("Chips", 0, 1)
    ).to.be.revertedWith("Quantity cannot be 0 or less than 0");
  });

  it("should not add snack with zero price", async function () {
    await expect(
      vendingMachine.connect(owner).addSnack("Chips", 10, 0)
    ).to.be.revertedWith("Price cannot be 0 or less than 0");
  });

  it("should not add duplicate snack", async function () {
    await vendingMachine.connect(owner).addSnack("Chips", 10, 1);
    await expect(
      vendingMachine.connect(owner).addSnack("Chips", 5, 2)
    ).to.be.revertedWith("Snack already exists");
  });
});
