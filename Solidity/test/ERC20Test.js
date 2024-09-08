const { expect } = require('chai');
const { BN, ether, expectRevert } = require('@openzeppelin/test-helpers');
const chai = require('chai');
chai.use(require('chai-bn')(BN));

const ConquerToken = artifacts.require('ConquerToken');
const TokenSale = artifacts.require('TokenSale');

contract('ConquerToken and TokenSale', (accounts) => {
  const [owner, buyer, other] = accounts;

  beforeEach(async function () {
    this.token = await ConquerToken.new({ from: owner });
    this.tokenSale = await TokenSale.new(this.token.address, { from: owner });
  
    const hasMinterRole = await this.token.hasRole(web3.utils.soliditySha3("MINTER_ROLE"), owner);
    console.log(`Owner has MINTER_ROLE: ${hasMinterRole}`);
  });

  it('should allow the owner to mint tokens', async function () {
    await this.token.mintTokens({ from: owner });
    
    const balance = await this.token.balanceOf(owner);
    console.log(`Owner's balance after minting: ${balance.toString()} CNQT`);
    
    expect(balance).to.be.a.bignumber.equal(new BN('1000000000000000000000')); // 1000 tokens
  });

  it('should allow the owner to transfer tokens to the TokenSale contract', async function () {
    await this.token.mintTokens({ from: owner });

    await this.token.transfer(this.tokenSale.address, web3.utils.toWei('1000', 'ether'), { from: owner });

    const ownerBalanceAfterTransfer = await this.token.balanceOf(owner);
    console.log(`Owner's balance after transfer: ${ownerBalanceAfterTransfer.toString()} CNQT`);
    expect(ownerBalanceAfterTransfer).to.be.a.bignumber.equal(new BN('0')); // El balance debería ser 0 después de la transferencia

    const saleBalance = await this.token.balanceOf(this.tokenSale.address);
    console.log(`TokenSale contract balance after transfer: ${saleBalance.toString()} CNQT`);
    expect(saleBalance).to.be.a.bignumber.equal(new BN('1000000000000000000000')); // 1000 tokens
  });

  it('should allow buyers to purchase tokens', async function () {
    await this.token.mintTokens({ from: owner });
    await this.token.transfer(this.tokenSale.address, web3.utils.toWei('1000', 'ether'), { from: owner });

    const saleBalance = await this.token.balanceOf(this.tokenSale.address);
    console.log(`TokenSale contract balance: ${saleBalance.toString()} CNQT`);
  
    await this.tokenSale.purchase({ from: buyer, value: ether('1') });
  
    const buyerBalance = await this.token.balanceOf(buyer);
    console.log(`Buyer's token balance: ${buyerBalance.toString()} CNQT`);
    expect(buyerBalance).to.be.a.bignumber.equal(new BN('1000000000000000000')); // 1 token
  });

  it('should revert purchase if not enough Ether is sent', async function () {
    await expectRevert(
      this.tokenSale.purchase({ from: buyer, value: ether('0.5') }),
      'Not enough money'
    );
  });
});
