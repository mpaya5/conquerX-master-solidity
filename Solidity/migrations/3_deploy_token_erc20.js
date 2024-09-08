const ConquerToken = artifacts.require("ConquerToken");
const TokenSale = artifacts.require("TokenSale");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(ConquerToken);
  const tokenInstance = await ConquerToken.deployed();

  await deployer.deploy(TokenSale, tokenInstance.address);
  const tokenSaleInstance = await TokenSale.deployed();

  await tokenInstance.mintTokens({ from: accounts[0] });
  const tokenBalance = await tokenInstance.balanceOf(accounts[0]);
  console.log(`Owner's token balance after minting: ${tokenBalance.toString()}`);

  await tokenInstance.transfer(tokenSaleInstance.address, web3.utils.toWei('1000', 'ether'), { from: accounts[0] });
  const saleBalance = await tokenInstance.balanceOf(tokenSaleInstance.address);
  console.log(`TokenSale contract balance: ${saleBalance.toString()}`);
};
