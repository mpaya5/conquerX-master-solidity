const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("NFT", function () {
  let NFT;
  let nftInstance;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    NFT = await ethers.getContractFactory("NFT");
    nftInstance = await NFT.deploy("MyNFTCollection", "MNFT");
    await nftInstance.waitForDeployment();
  });

  it('should create a new NFT with the correct details', async function () {
    await nftInstance.connect(user1).createRandomNFT(
      "NFT1", 
      { value: ethers.parseEther("2") }
    );
    
    await nftInstance.connect(user2).createRandomNFT(
      "NFT2", 
      { value: ethers.parseEther("2") }
    );

    const user1NFTs = await nftInstance.getNftsByOwner(user1.address);
    const user2NFTs = await nftInstance.getNftsByOwner(user2.address);

    expect(user1NFTs.length).to.equal(1, "User1 should have 1 NFT");
    expect(user2NFTs.length).to.equal(1, "User2 should have 1 NFT");
    expect(user1NFTs[0].name).to.equal("NFT1", "NFT1 name is incorrect");
    expect(user2NFTs[0].name).to.equal("NFT2", "NFT2 name is incorrect");
  });

  it('should not allow minting without sufficient payment', async function () {
    await expect(
      nftInstance.connect(user1).createRandomNFT("NFT3", { 
        value: ethers.parseEther("1") 
      })
    ).to.be.revertedWith("Insufficient money");
  });

  it('should allow leveling up an NFT', async function () {
    await nftInstance.connect(user1).createRandomNFT("NFT4", { 
      value: ethers.parseEther("2") 
    });

    const initialNFTs = await nftInstance.getNftsByOwner(user1.address);
    const initialLevel = Number(initialNFTs[0].level);
    console.log('Initial Level:', initialLevel);

    await nftInstance.connect(user1).levelUp(0, { 
      value: ethers.parseEther("1") 
    });

    const updatedNFTs = await nftInstance.getNftsByOwner(user1.address);
    const updatedLevel = Number(updatedNFTs[0].level);
    console.log('Updated Level:', updatedLevel);

    expect(updatedLevel).to.equal(initialLevel + 1, 
      `Level should increase by 1 (from ${initialLevel} to ${initialLevel + 1})`
    );
  });

  it('should allow owner to update prices', async function () {
    const newPrice = ethers.parseEther("3");
    await nftInstance.connect(owner).updatePrice(newPrice);
    
    const updatedPrice = await nftInstance.price();
    expect(updatedPrice).to.equal(newPrice, "Price should be updated");
  });

  it('should not allow non-owners to update prices', async function () {
    const newPrice = ethers.parseEther("3");
    await expect(
      nftInstance.connect(user1).updatePrice(newPrice)
    ).to.be.revertedWithCustomError(nftInstance, "OwnableUnauthorizedAccount");
  });

  it('should verify correct level up price', async function () {
    await nftInstance.connect(user1).createRandomNFT("NFT5", { 
      value: ethers.parseEther("2") 
    });

    await expect(
      nftInstance.connect(user1).levelUp(0, { 
        value: ethers.parseEther("0.5") 
      })
    ).to.be.revertedWith("Insufficient money");
  });
});
