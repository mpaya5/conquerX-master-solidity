const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("Starting VendingMachine simulation...\n");

    // Get signers
    const [owner, buyer] = await ethers.getSigners();
    console.log("Owner address:", owner.address);
    console.log("Buyer address:", buyer.address);

    // Deploy contract
    const VendingMachine = await ethers.getContractFactory("VendingMachine");
    const vendingMachine = await VendingMachine.deploy();
    await vendingMachine.waitForDeployment();
    console.log("VendingMachine deployed to:", await vendingMachine.getAddress(), "\n");

    // Add snacks (usando precios enteros)
    console.log("Adding snacks...");
    const snacks = [
      { name: "Soda", quantity: 100, price: 1 },
      { name: "Chips", quantity: 50, price: 2 },
      { name: "Chocolate", quantity: 75, price: 2 }  // Cambiado de 1.5 a 2
    ];

    for (const snack of snacks) {
      const tx = await vendingMachine.connect(owner).addSnack(
        snack.name, 
        snack.quantity, 
        snack.price
      );
      await tx.wait();
      console.log(`Added ${snack.name} - Quantity: ${snack.quantity}, Price: ${snack.price} ETH`);
    }

    // Display initial inventory
    console.log("\nInitial Inventory:");
    const initialSnacks = await vendingMachine.getAllSnacks();
    displaySnacks(initialSnacks);

    // Restock a snack
    console.log("\nRestocking Soda...");
    await vendingMachine.connect(owner).restockSnack(0, 50);
    console.log("Restocked 50 more Sodas");

    // Buy snacks
    console.log("\nBuying snacks...");
    const buyerInitialBalance = await ethers.provider.getBalance(buyer.address);
    console.log("Buyer initial balance:", ethers.formatEther(buyerInitialBalance), "ETH");

    // Buy multiple snacks (usando valores enteros)
    const purchases = [
      { id: 0, amount: 2, value: "2" },  // 2 Sodas
      { id: 1, amount: 1, value: "2" },  // 1 Chips
      { id: 2, amount: 2, value: "4" }   // 2 Chocolates
    ];

    for (const purchase of purchases) {
      try {
        const tx = await vendingMachine.connect(buyer).buySnack(
          purchase.id, 
          purchase.amount, 
          { value: ethers.parseEther(purchase.value) }
        );
        await tx.wait();
        const snack = (await vendingMachine.getAllSnacks())[purchase.id];
        console.log(`Bought ${purchase.amount} ${snack.name}(s) for ${purchase.value} ETH`);
      } catch (error) {
        console.error(`Failed to buy snack ${purchase.id}:`, error.message);
      }
    }

    // Check machine balance
    const machineBalance = await vendingMachine.connect(owner).getMachineBalance();
    console.log("\nVending Machine balance:", ethers.formatEther(machineBalance), "ETH");

    // Withdraw balance
    console.log("\nWithdrawing balance...");
    const ownerInitialBalance = await ethers.provider.getBalance(owner.address);
    
    const withdrawTx = await vendingMachine.connect(owner).withdrawBalance();
    await withdrawTx.wait();

    const ownerFinalBalance = await ethers.provider.getBalance(owner.address);
    console.log("Owner balance change:", 
      ethers.formatEther(ownerFinalBalance - ownerInitialBalance), "ETH");

    // Display final inventory
    console.log("\nFinal Inventory:");
    const finalSnacks = await vendingMachine.getAllSnacks();
    displaySnacks(finalSnacks);

    console.log("\nSimulation completed successfully!");

  } catch (error) {
    console.error("\nError in simulation:", error);
    process.exitCode = 1;
  }
}

function displaySnacks(snacks) {
  snacks.forEach((snack, index) => {
    console.log(`${index}. ${snack.name}:`);
    console.log(`   Quantity: ${snack.quantity}`);
    console.log(`   Price: ${ethers.formatEther(snack.price)} ETH`);
  });
}

// Execute simulation
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
