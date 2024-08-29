const VendingMachine = artifacts.require("VendingMachine");

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const buyer = accounts[1];

    const instance = await VendingMachine.deployed();

    console.log("Adding new snack...");
    await instance.addSnack("Soda", 100, 1, { from: owner });

    console.log("Getting all the snacks...");
    allSnacks = await instance.getAllSnacks();
    console.log(allSnacks);

    console.log("Restocking snack...");
    await instance.restockSnack(0, 50, { from: owner });
    console.log("Snack reestocked:")
    allSnacks = await instance.getAllSnacks()
    console.log("Now Soda has just: " + allSnacks[0].quantity + " quantity");

    console.log("Buying a snack...");
    await instance.buySnack(0, 1, { from: buyer, value: web3.utils.toWei("1", "ether") });
    allSnacks = await instance.getAllSnacks()
    snack = allSnacks[0];
    console.log("Now there are just " + snack.quantity + " of " + snack.name + " left");

    console.log("Withdrawing balance...");
    await instance.withdrawBalance({ from: owner });

    const ownerBalance = await web3.eth.getBalance(owner);
    console.log("Now the owner has that amount: " + web3.utils.fromWei(ownerBalance, 'ether') + " ETH");

    console.log("Simulation completed successfully.");
    callback();
  } catch (error) {
    console.error("Error during simulation:", error);
    callback(error);
  }
};
