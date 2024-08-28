const VendingMachine = artifacts.require("VendingMachine");

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const instance = await VendingMachine.deployed();

    // Iterating from the first account (owner)
    await instance.addProduct("Candy", 100, 1, { from: accounts[0] });
    console.log("'Candy' product added correctly.");

    // Trying to restock the product Candy with the second account (no owner)
    try {
      await instance.restockProduct("Candy", 50, { from: accounts[1] });
      console.log("'Candy' product restock correctly.");
    } catch (error) {
      console.error("Error: This account cannot restock products (ERROR EXPECTED).");
    }

    callback();
  } catch (error) {
    console.error("Error during the contract iteration:", error);
    callback(error);
  }
};
