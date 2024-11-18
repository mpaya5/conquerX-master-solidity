const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("Starting Token interaction simulation...\n");

    // Get signers
    const [owner, buyer] = await ethers.getSigners();
    console.log("Owner address:", owner.address);
    console.log("Buyer address:", buyer.address);

    // Deploy ConquerToken
    const ConquerToken = await ethers.getContractFactory("ConquerToken");
    const tokenInstance = await ConquerToken.deploy();
    await tokenInstance.waitForDeployment();
    console.log("ConquerToken deployed to:", await tokenInstance.getAddress());

    // Deploy TokenSale
    const TokenSale = await ethers.getContractFactory("TokenSale");
    const tokenSaleInstance = await TokenSale.deploy(await tokenInstance.getAddress());
    await tokenSaleInstance.waitForDeployment();
    console.log("TokenSale deployed to:", await tokenSaleInstance.getAddress(), "\n");

    // Mint tokens as owner
    console.log("Minting tokens...");
    const mintTx = await tokenInstance.connect(owner).mintTokens();
    await mintTx.wait();
    
    // Check owner's balance
    let ownerBalance = await tokenInstance.balanceOf(owner.address);
    console.log(`Owner's initial token balance: ${ethers.formatEther(ownerBalance)} CNQT`);

    // Transfer tokens to TokenSale contract
    console.log("\nTransferring tokens to TokenSale contract...");
    const transferAmount = ethers.parseEther("100");
    await tokenInstance.connect(owner).transfer(tokenSaleInstance.getAddress(), transferAmount);
    
    // Check TokenSale contract balance
    let saleBalance = await tokenInstance.balanceOf(await tokenSaleInstance.getAddress());
    console.log(`TokenSale contract balance: ${ethers.formatEther(saleBalance)} CNQT`);

    // Buyer purchases tokens
    console.log("\nBuyer is purchasing tokens...");
    const purchaseAmount = 5; // Comprar 5 tokens
    const purchaseValue = ethers.parseEther(purchaseAmount.toString()); // 1 ETH por token
    
    await tokenSaleInstance.connect(buyer).purchase(purchaseAmount, {
      value: purchaseValue
    });

    // Check balances after purchase
    let buyerBalance = await tokenInstance.balanceOf(buyer.address);
    console.log(`Buyer's token balance: ${ethers.formatEther(buyerBalance)} CNQT`);
    
    ownerBalance = await tokenInstance.balanceOf(owner.address);
    console.log(`Owner's final token balance: ${ethers.formatEther(ownerBalance)} CNQT`);

    // Get token details
    const name = await tokenInstance.name();
    const symbol = await tokenInstance.symbol();
    const decimals = await tokenInstance.decimals();
    const totalSupply = await tokenInstance.totalSupply();

    console.log("\nToken Details:");
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Decimals: ${decimals}`);
    console.log(`Total Supply: ${ethers.formatEther(totalSupply)} CNQT`);

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
