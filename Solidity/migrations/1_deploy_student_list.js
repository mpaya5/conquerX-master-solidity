const StudentsList = artifacts.require("StudentsList");

module.exports = function (deployer) {
    deployer.deploy(VendingMachine);
  };