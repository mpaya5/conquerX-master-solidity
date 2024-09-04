const VendingMachine = artifacts.require("VendingMachine");

module.exports = function (deployer, network, accounts) {
  const owner = accounts[0]; 
  deployer.deploy(VendingMachine, owner);
};