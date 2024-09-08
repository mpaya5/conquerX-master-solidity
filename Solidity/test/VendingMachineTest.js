const { expect } = require('chai');

const VendingMachine = artifacts.require("VendingMachine");

contract("VendingMachine", (accounts) => {
  const [owner, buyer] = accounts;

  it("should add a new snack", async () => {
    const instance = await VendingMachine.deployed();
    await instance.addSnack("Chips", 100, 1, { from: owner });

    const snacks = await instance.getAllSnacks();

    assert.equal(snacks.length, 1, "Snack was not added correctly");
    assert.equal(snacks[0].name, "Chips", "Snack name mismatch");
  });

  it("should not allow non-owner to add a snack", async () => {
    const instance = await VendingMachine.deployed();
    try {
      await instance.addSnack("Soda", 100, 1, { from: buyer });
  
      assert.fail("Non-owner should not be able to add a snack");
    } catch (error) {
      assert(error.message.includes("You cannot access this data"), "Incorrect error message");
    }
  });
  

  it("should restock an existing snack", async () => {
    const instance = await VendingMachine.deployed();
    await instance.restockSnack(0, 50, { from: owner });

    const snacks = await instance.getAllSnacks();

    assert.equal(snacks[0].quantity, 150, "Snack quantity was not restocked correctly");
  });

  it("should allow a user to buy a snack", async () => {
    const instance = await VendingMachine.deployed();
    const initialOwnerBalance = new web3.utils.BN(await web3.eth.getBalance(owner));

    const contractBalanceBefore = new web3.utils.BN(await web3.eth.getBalance(instance.address));
    console.log("Contract balance before purchase:", contractBalanceBefore.toString());

    await instance.buySnack(0, 1, { from: buyer, value: web3.utils.toWei("1", "ether") });

    const contractBalanceAfter = new web3.utils.BN(await web3.eth.getBalance(instance.address));
    console.log("Contract balance after purchase:", contractBalanceAfter.toString());

    const snacks = await instance.getAllSnacks();
    assert.equal(snacks[0].quantity, 149, "Snack quantity did not decrease correctly");

    assert.isTrue(contractBalanceAfter.sub(contractBalanceBefore).eq(web3.utils.toBN(web3.utils.toWei("1", "ether"))), "Contract balance did not increase correctly");

    const finalOwnerBalance = new web3.utils.BN(await web3.eth.getBalance(owner));
    console.log("Owner balance before:", initialOwnerBalance.toString());
    console.log("Owner balance after:", finalOwnerBalance.toString());

  });

  it("should allow the owner to withdraw the balance", async () => {
    const instance = await VendingMachine.deployed();
    const initialBalance = new web3.utils.BN(await web3.eth.getBalance(owner));

    await instance.withdrawBalance({ from: owner });

    const finalBalance = new web3.utils.BN(await web3.eth.getBalance(owner));
    assert.isTrue(finalBalance.gt(initialBalance), "Owner's balance did not increase after withdrawal");
  });
});
