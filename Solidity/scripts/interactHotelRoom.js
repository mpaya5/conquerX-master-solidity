const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("Starting HotelRoom interaction simulation...\n");

    // Get signers
    const [owner, client] = await ethers.getSigners();
    console.log("Owner address:", owner.address);
    console.log("Client address:", client.address);

    // Deploy contract
    const HotelRoom = await ethers.getContractFactory("HotelRoom");
    const hotelRoom = await HotelRoom.deploy();
    await hotelRoom.waitForDeployment();
    console.log("\nHotelRoom deployed to:", await hotelRoom.getAddress());

    // Get initial balances
    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
    console.log("\nInitial owner balance:", ethers.formatEther(initialOwnerBalance), "ETH");
    const initialClientBalance = await ethers.provider.getBalance(client.address);
    console.log("Initial client balance:", ethers.formatEther(initialClientBalance), "ETH");

    // Check initial room status
    const initialStatus = await hotelRoom.currentRoomStatus();
    console.log("\nInitial room status:", getRoomStatus(initialStatus));

    // Book the room
    console.log("\nTrying to book the room...");
    const bookingTx = await hotelRoom.connect(client).bookRoom({
      value: ethers.parseEther("1")
    });
    await bookingTx.wait();
    console.log("Room booked successfully!");

    // Check new room status
    const newStatus = await hotelRoom.currentRoomStatus();
    console.log("Current room status:", getRoomStatus(newStatus));

    // Check updated balances
    const updatedOwnerBalance = await ethers.provider.getBalance(owner.address);
    console.log("\nUpdated owner balance:", ethers.formatEther(updatedOwnerBalance), "ETH");
    console.log("Owner balance change:", 
      ethers.formatEther(updatedOwnerBalance - initialOwnerBalance), "ETH");

    // Try to book again (should fail)
    console.log("\nTrying to book an occupied room...");
    try {
      await hotelRoom.connect(client).bookRoom({
        value: ethers.parseEther("1")
      });
    } catch (error) {
      console.log("Error caught successfully:", error.message);
    }

    // Free the room
    console.log("\nFreeing the room...");
    const freeTx = await hotelRoom.connect(owner).freeRoom();
    await freeTx.wait();
    
    const finalStatus = await hotelRoom.currentRoomStatus();
    console.log("Final room status:", getRoomStatus(finalStatus));

    // Try to free room as non-owner (should fail)
    console.log("\nTrying to free room as non-owner...");
    try {
      await hotelRoom.connect(client).freeRoom();
    } catch (error) {
      console.log("Error caught successfully:", error.message);
    }

    console.log("\nSimulation completed successfully!");

  } catch (error) {
    console.error("\nError in simulation:", error);
    process.exitCode = 1;
  }
}

// Helper function to convert room status to string
function getRoomStatus(status) {
  return status === 0 ? "OCCUPIED" : "VACANT";
}

// Execute simulation
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});