const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("Starting Bank interaction simulation...\n");

    // Get signers
    const [account1, account2] = await ethers.getSigners();
    console.log("Account 1 address:", account1.address);
    console.log("Account 2 address:", account2.address);

    // Deploy contract
    const Bank = await ethers.getContractFactory("Bank");
    const bank = await Bank.deploy();
    await bank.waitForDeployment();
    console.log("\nBank deployed to:", await bank.getAddress());

    // Add balance to account 1
    console.log("\nAdding balance to account 1...");
    const addTx = await bank.connect(account1).addBalance(100);
    await addTx.wait();
    console.log("Balance added to account 1");

    // Get balance for account 1
    console.log("\nGetting balance for account 1...");
    let balance = await bank.connect(account1).getBalance();
    console.log("Account 1 balance:", balance.toString());

    // Transfer balance from account 1 to account 2
    console.log("\nTransferring balance from account 1 to account 2...");
    const transferTx = await bank.connect(account1).transferBalance(account2.address, 50);
    await transferTx.wait();
    console.log("Transfer complete");

    // Get updated balances
    console.log("\nGetting updated balances...");
    
    balance = await bank.connect(account1).getBalance();
    console.log("Account 1 balance:", balance.toString());

    balance = await bank.connect(account2).getBalance();
    console.log("Account 2 balance:", balance.toString());

    // Try to transfer more than available balance (should fail)
    console.log("\nTrying to transfer more than available balance...");
    try {
      await bank.connect(account1).transferBalance(account2.address, 1000);
    } catch (error) {
      console.log("Error caught successfully:", error.message);
    }

    // Try to transfer with zero balance (should fail)
    console.log("\nTrying to transfer with zero balance from account 2...");
    try {
      await bank.connect(account2).transferBalance(account1.address, 100);
    } catch (error) {
      console.log("Error caught successfully:", error.message);
    }

    console.log("\nSimulation completed successfully!");

  } catch (error) {
    console.error("\nError in simulation:", error);
    process.exitCode = 1;
  }
}

// Execute simulation
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
