const HotelRoom = artifacts.require("HotelRoom");

module.exports = function (deployer) {
  deployer.deploy(HotelRoom);
};