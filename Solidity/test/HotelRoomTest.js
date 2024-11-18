const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("HotelRoom", function () {
  let HotelRoom;
  let hotelRoom;
  let owner;
  let client;

  beforeEach(async function () {
    [owner, client] = await ethers.getSigners();
    
    // Deploy contract
    HotelRoom = await ethers.getContractFactory("HotelRoom");
    hotelRoom = await HotelRoom.deploy();
    await hotelRoom.waitForDeployment();
  });

  it("should be the room with status vacant", async function () {
    const currentRoomStatus = await hotelRoom.currentRoomStatus();
    expect(currentRoomStatus).to.equal(1); // VACANT = 1
  });

  it("should book the room and withdraw the balance", async function () {
    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

    // Book room
    await hotelRoom.connect(client).bookRoom({ 
      value: ethers.parseEther("1") 
    });

    // Check room status
    const currentRoomStatus = await hotelRoom.currentRoomStatus();
    expect(currentRoomStatus).to.equal(0); // OCCUPIED = 0

    // Check owner received payment
    const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
    expect(finalOwnerBalance).to.be.gt(initialOwnerBalance);
  });

  it("should not allow booking if insufficient value sent", async function () {
    await expect(
      hotelRoom.connect(client).bookRoom({ 
        value: ethers.parseEther("0.5") 
      })
    ).to.be.revertedWith("Insufficient value sent");
  });

  it("should not allow booking if room is occupied", async function () {
    // First booking
    await hotelRoom.connect(client).bookRoom({ 
      value: ethers.parseEther("1") 
    });

    // Second booking should fail
    await expect(
      hotelRoom.connect(client).bookRoom({ 
        value: ethers.parseEther("1") 
      })
    ).to.be.revertedWith("The room is occupied");
  });

  it("should allow only owner to free the room", async function () {
    // Book room first
    await hotelRoom.connect(client).bookRoom({ 
      value: ethers.parseEther("1") 
    });

    // Client tries to free room
    await expect(
      hotelRoom.connect(client).freeRoom()
    ).to.be.revertedWith("You cannot access this data");

    // Owner frees room
    await hotelRoom.connect(owner).freeRoom();
    const currentRoomStatus = await hotelRoom.currentRoomStatus();
    expect(currentRoomStatus).to.equal(1); // VACANT = 1
  });
});