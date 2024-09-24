const NFT = artifacts.require("NFT");

module.exports = async function(deployer) {
    const name = "MyNFTCollection";
    const symbol = "MNFT";

    deployer.deploy(NFT, name, symbol);
}