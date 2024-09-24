const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect } = require('chai');

const NFT = artifacts.require("NFT");

contract("NFT", (accounts) => {
    const [owner, user1, user2] = accounts;

    beforeEach(async function () {
        this.nftInstance = await NFT.new("MyNFTCollection", "MNFT", { from: owner });
    });

    it('should create a new NFT with the correct details', async () => {
        await this.nftInstance.createRandomNFT("NFT1", { from: user1, value: web3.utils.toWei('2', 'ether') });
        await this.nftInstance.createRandomNFT("NFT2", { from: user2, value: web3.utils.toWei('2', 'ether') });

        const user1NFTs = await this.nftInstance.getNftsByOwner(user1);
        const user2NFTs = await this.nftInstance.getNftsByOwner(user2);

        expect(user1NFTs.length).to.equal(1);
        expect(user2NFTs.length).to.equal(1);
        expect(user1NFTs[0].name).to.equal("NFT1");
        expect(user2NFTs[0].name).to.equal("NFT2");
    });

    
})