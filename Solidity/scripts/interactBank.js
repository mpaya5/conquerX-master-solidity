const Bank = artifacts.require("Bank");

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const account1 = accounts[0];
    const account2 = accounts[1];

    const instance = await Bank.deployed();

    console.log("Adding balance to account 1...");
    await instance.addBalance(100, { from: account1 });
    console.log("Balance added to account 1.");

    console.log("Getting balance for account 1...");
    let balance = await instance.getBalance({ from: account1 });
    console.log("Account 1 balance:", balance.toString());

    console.log("Transferring balance from account 1 to account 2...");
    await instance.transferBalance(account2, 50, { from: account1 });
    console.log("Transfer complete.");

    console.log("Getting balance for account 1...");
    balance = await instance.getBalance({ from: account1 });
    console.log("Account 1 balance:", balance.toString());

    console.log("Getting balance for account 2...");
    balance = await instance.getBalance({ from: account2 });
    console.log("Account 2 balance:", balance.toString());

    callback();
  } catch (error) {
    console.error("Error during interaction with Bank contract:", error);
    callback(error);
  }
};
