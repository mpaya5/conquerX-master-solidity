const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Bank", function () {
  let Bank;
  let bank;
  let owner;
  let account1;
  let account2;

  beforeEach(async function () {
    [owner, account1, account2] = await ethers.getSigners();
    Bank = await ethers.getContractFactory("Bank");
    bank = await Bank.deploy();
    await bank.waitForDeployment();
  });

  it("should add balance to an account", async function () {
    await bank.connect(account1).addBalance(100);
    const balance = await bank.connect(account1).getBalance();
    expect(balance.toString()).to.equal("100");
  });

  it("should transfer balance between accounts", async function () {
    await bank.connect(account1).addBalance(100);
    await bank.connect(account1).transferBalance(account2.address, 50);

    const balance1 = await bank.connect(account1).getBalance();
    expect(balance1.toString()).to.equal("50");

    const balance2 = await bank.connect(account2).getBalance();
    expect(balance2.toString()).to.equal("50");
  });

  it("should not transfer balance if sender has insufficient funds", async function () {
    await bank.connect(account1).addBalance(50);
    
    await expect(
      bank.connect(account1).transferBalance(account2.address, 100)
    ).to.be.revertedWithCustomError(bank, "InsufficientFunds")
      .withArgs(50, 100);
  });
});
