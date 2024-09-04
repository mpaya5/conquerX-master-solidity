const HotelRoom = artifacts.require("HotelRoom");

module.exports = function (deployer, network, accounts) {
  const owner = accounts[0];
  deployer.deploy(HotelRoom, owner);
};