const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("ConquerToken and TokenSale", function () {
  let ConquerToken;
  let TokenSale;
  let token;
  let tokenSale;
  let owner;
  let buyer;
  let other;

  beforeEach(async function () {
    [owner, buyer, other] = await ethers.getSigners();
    
    ConquerToken = await ethers.getContractFactory("ConquerToken");
    token = await ConquerToken.deploy();
    await token.waitForDeployment();

    TokenSale = await ethers.getContractFactory("TokenSale");
    tokenSale = await TokenSale.deploy(await token.getAddress());
    await tokenSale.waitForDeployment();

    const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
    const hasMinterRole = await token.hasRole(MINTER_ROLE, owner.address);
    console.log(`Owner has MINTER_ROLE: ${hasMinterRole}`);
  });

  it("should allow the owner to mint tokens", async function () {
    await token.connect(owner).mintTokens();
    const balance = await token.balanceOf(owner.address);
    console.log(`Owner's balance after minting: ${balance.toString()} CNQT`);
    expect(balance).to.equal(ethers.parseEther("1000"));
  });

  it("should allow the owner to transfer tokens to the TokenSale contract", async function () {
    await token.connect(owner).mintTokens();
    await token.connect(owner).transfer(await tokenSale.getAddress(), ethers.parseEther("1000"));

    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance).to.equal(0);

    const saleBalance = await token.balanceOf(await tokenSale.getAddress());
    expect(saleBalance).to.equal(ethers.parseEther("1000"));
  });

  it("should allow buyers to purchase tokens", async function () {
    await token.connect(owner).mintTokens();
    await token.connect(owner).transfer(await tokenSale.getAddress(), ethers.parseEther("1000"));

    await tokenSale.connect(buyer).purchase(1, { 
      value: ethers.parseEther("1") 
    });

    const buyerBalance = await token.balanceOf(buyer.address);
    expect(buyerBalance).to.equal(ethers.parseEther("1"));
  });

  it("should revert purchase if not enough Ether is sent", async function () {
    await token.connect(owner).mintTokens();
    await token.connect(owner).transfer(await tokenSale.getAddress(), ethers.parseEther("1000"));

    await expect(
      tokenSale.connect(buyer).purchase(1, { 
        value: ethers.parseEther("0.5") 
      })
    ).to.be.revertedWith("Not enough money");
  });
});
