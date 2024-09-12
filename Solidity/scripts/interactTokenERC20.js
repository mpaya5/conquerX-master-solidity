const ConquerToken = artifacts.require("ConquerToken");
const TokenSale = artifacts.require("TokenSale");

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const buyer = accounts[1];

    const tokenInstance = await ConquerToken.deployed();
    const tokenSaleInstance = await TokenSale.deployed();

    let ownerBalance = await tokenInstance.balanceOf(owner);
    console.log(`Owner's token balance: ${web3.utils.fromWei(ownerBalance, 'ether')} CNQT`);

    console.log('Buyer is purchasing tokens...');
    await tokenSaleInstance.purchase(1,{ from: buyer, value: web3.utils.toWei('1', 'ether') });

    let buyerBalance = await tokenInstance.balanceOf(buyer);
    console.log(`Buyer's token balance: ${web3.utils.fromWei(buyerBalance, 'ether')} CNQT`);

    callback();
  } catch (error) {
    console.error(error);
    callback(error);
  }
};
