const Bank = artifacts.require("Bank");

contract("Bank", (accounts) => {
  const account1 = accounts[0];
  const account2 = accounts[1];

  it("should add balance to an account", async () => {
    const instance = await Bank.deployed();
    await instance.addBalance(100, { from: account1 });

    const balance = await instance.getBalance({ from: account1 });
    
    assert.equal(balance.toString(), "100", "Balance was not added correctly");
  });

  it("should transfer balance between accounts", async () => {
    const instance = await Bank.deployed();
    await instance.transferBalance(account2, 50, { from: account1 });

    const balance1 = await instance.getBalance({ from: account1 });
    assert.equal(balance1.toString(), "50", "Balance was not deducted correctly from account 1");

    const balance2 = await instance.getBalance({ from: account2 });
    assert.equal(balance2.toString(), "50", "Balance was not credited correctly to account 2");
  });

  it("should not transfer balance if sender has insufficient funds", async () => {
    const instance = await Bank.deployed();
    const initialBalance1 = await instance.getBalance({ from: account1 });
    const initialBalance2 = await instance.getBalance({ from: account2 });

    // Attempt to transfer more than the available balance
    await instance.transferBalance(account2, 100, { from: account1 });

    const finalBalance1 = await instance.getBalance({ from: account1 });
    const finalBalance2 = await instance.getBalance({ from: account2 });

    assert.equal(finalBalance1.toString(), initialBalance1.toString(), "Balance of account 1 should not change");
    assert.equal(finalBalance2.toString(), initialBalance2.toString(), "Balance of account 2 should not change");
  });
});
