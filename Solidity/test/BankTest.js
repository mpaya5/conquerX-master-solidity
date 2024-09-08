const { expect } = require('chai');

const Bank = artifacts.require("Bank");

contract("Bank", (accounts) => {
  const [account1, account2] = accounts;

  it("should add balance to an account", async () => {
    const instance = await Bank.deployed();
    await instance.addBalance(100, { from: account1 });

    const balance = await instance.getBalance({ from: account1 });
    expect(balance.toString()).to.equal("100", "Balance was not added correctly");
  });

  it("should transfer balance between accounts", async () => {
    const instance = await Bank.deployed();
    await instance.transferBalance(account2, 50, { from: account1 });

    const balance1 = await instance.getBalance({ from: account1 });
    expect(balance1.toString()).to.equal("50", "Balance was not deducted correctly from account 1");

    const balance2 = await instance.getBalance({ from: account2 });
    expect(balance2.toString()).to.equal("50", "Balance was not credited correctly to account 2");
  });

  it("should not transfer balance if sender has insufficient funds", async () => {
    const instance = await Bank.deployed();
    const initialBalance1 = await instance.getBalance({ from: account1 });
    const initialBalance2 = await instance.getBalance({ from: account2 });

    try {
      await instance.transferBalance(account2, 100, { from: account1 });
      assert.fail("Expected an error but did not get one");
    } catch (error) {
      expect(error.reason).to.equal(undefined, "Expected revert due to insufficient funds");
    }

    const finalBalance1 = await instance.getBalance({ from: account1 });
    const finalBalance2 = await instance.getBalance({ from: account2 });

    expect(finalBalance1.toString()).to.equal(initialBalance1.toString(), "Balance of account 1 should not change");
    expect(finalBalance2.toString()).to.equal(initialBalance2.toString(), "Balance of account 2 should not change");
  });
});
