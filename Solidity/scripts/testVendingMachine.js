const VendingMachine = artifacts.require("VendingMachine");

module.exports = async function(callback) {
  try {
    const instance = await VendingMachine.deployed();

    // Add a product
    await instance.addProduct("Chips", 100, 2);
    console.log("'Chips' product added.");

    // restock a product
    await instance.restockProduct("Chips", 50);
    console.log("Chip product restock correctly");

    // Get all products
    const snacks = await instance.getAllSnacks();
    console.log("Available snacks:");
    snacks.forEach(snack => {
      console.log(`ID: ${snack.id}, Name: ${snack.name}, Quantity: ${snack.quantity}, Price: ${snack.price}`);
    });

    callback();
  } catch (error) {
    console.error("Error during the contract iteration:", error);
    callback(error);
  }
};
