// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NTF implementation
 * @dev Create a NFT implementing the ERC721 standard
 */
contract NFT is ERC721, Ownable {
    // Counter for NFTs and base prices for minting and leveling up
    uint256 public counter;
    uint256 public price = 2 ether;       // Price for minting new NFTs
    uint256 public priceLevelUp = 1 ether; // Price for leveling up NFTs

    // NFT structure definition
    struct Nft {
        string name;   // Name of the NFT
        uint256 id;    // Unique identifier for the NFT
        uint8 level;   // Current level of the NFT
        uint8 rarity;  // Rarity value (randomly generated)
        address owner; // Owner of the NFT
    }

    // Array to store all NFTs created
    Nft[] public nfts;

    // Mapping from owner to the list of their NFTs
    mapping(address => Nft[]) private _ownerNfts;

    // Event triggered when a new NFT is minted
    event NewNFT(address owner, uint256 id, string name);

    /**
     * @dev Initializes the contract by setting a name and a symbol for the NFT collection.
     * @param _name The name of the NFT collection.
     * @param _symbol The symbol of the NFT collection.
     */
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) Ownable(msg.sender) {
        counter = 0;
    }

    /**
     * @dev Updates the price for minting new NFTs. Only callable by the contract owner.
     * @param _price New price for minting an NFT (in wei).
     */
    function updatePrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    /**
     * @dev Updates the price for leveling up NFTs. Only callable by the contract owner.
     * @param _price New price for leveling up an NFT (in wei).
     */
    function updatePriceLevelUp(uint256 _price) external onlyOwner {
        priceLevelUp = _price;
    }

    /**
     * @dev Returns all NFTs that have been created.
     * @return An array of all NFTs.
     */
    function getAllNFTs() public view returns (Nft[] memory) {
        return nfts;
    }

    /**
     * @dev Returns all NFTs owned by a specific owner.
     * @param _owner The address of the NFT owner.
     * @return An array of NFTs owned by the given address.
     */
    function getNftsByOwner(address _owner) public view returns (Nft[] memory) {
        return _ownerNfts[_owner];
    }

    /**
     * @dev Allows a user to create a new NFT by paying the required price. 
     * Excess Ether is returned to the caller.
     * @param _name The name of the NFT to be created.
     */
     function createRandomNFT(string memory _name) public payable {
        require(msg.value >= price, "Insufficient money");
        _createNFT(_name);

        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price); // Return the excess
        }
    }

    /**
     * @notice Allows the owner of an NFT to level it up by paying the required price.
     * @dev Increases the level of the NFT by 1 if the caller is the owner and pays enough Ether. 
     * Excess Ether is returned to the caller.
     * @param _id The ID of the NFT to level up.
     */
    function levelUp(uint256 _id) public payable {
        require(msg.value >= price, "Insufficient money");
        require(ownerOf(_id) == msg.sender, "You have not enough permissions");

        nfts[_id].level ++;

        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price); // Return the excess
        }
    }

    /**
     * @dev Allows the contract owner to withdraw the entire balance of the contract.
     * Only the contract owner can call this function.
     */
    function withdraw() external payable onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }


    /**
     * @dev Generates a pseudo-random number based on the block timestamp and message sender.
     * @param _num The upper bound for the random number (exclusive).
     * @return A pseudo-random number between 0 and _num-1.
     */
    function _randomNumber(uint256 _num) internal view returns (uint256) {
        bytes32 uniqueHash = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        uint256 randomNumber = uint256(uniqueHash);
        return randomNumber % _num;
    }

    /**
     * @dev Creates a new NFT with a randomly generated rarity and mints it to the caller.
     * @param _name The name of the new NFT.
     */
    function _createNFT(string memory _name) internal {
        uint8 _rarity = uint8(_randomNumber(1000));

        // Create the new NFT
        Nft memory newToken = Nft({
            name: _name,
            id: counter,
            level: 1,
            rarity: _rarity,
            owner: msg.sender
        });

        // Mint the NFT and update storage
        _safeMint(msg.sender, counter);
        _ownerNfts[msg.sender].push(newToken);  // Store NFT in the owner's list
        nfts.push(newToken);                    // Add to the global list of NFTs

        emit NewNFT(msg.sender, counter, _name);
        counter++;
    }
}