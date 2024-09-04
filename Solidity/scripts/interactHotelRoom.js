const HotelRoom = artifacts.require('HotelRoom');

module.exports = async function(callback) {
    try {
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0];
        const client = accounts[1];
        
        const instance = await HotelRoom.deployed();

        const ownerBalance = await web3.eth.getBalance(owner);
        console.log("The current balance of the owner is: " + web3.utils.fromWei(ownerBalance, 'ether') + " ETH");

        console.log("Trying to book the room...");
        console.log("The room status is: " + await instance.currentRoomStatus());
        await instance.bookRoom({from: client, value: web3.utils.toWei("1", "ether")});
        console.log("Now, the room status is: " + await instance.currentRoomStatus());

        console.log("The balance should have withdraw to the owner...");
        console.log("Now the owner has that balance: " + web3.utils.fromWei(await web3.eth.getBalance(owner), 'ether') + " ETH")

        await instance.freeRoom();
        callback();

    } catch (error) {
        console.error("Error during simulation: " + error);
        callback(error);
    }
}