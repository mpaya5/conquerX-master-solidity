const { expect } = require('chai');

const HotelRoom = artifacts.require('HotelRoom');

contract("HotelRoom", (accounts) => {
    const [owner, client] = accounts;

    it("should be the room with status vacant", async () => {
        const instance = await HotelRoom.deployed();
        const currentRoomStatus = await instance.currentRoomStatus();

        assert.equal(currentRoomStatus.toString(), '1', "The room should be VACANT (1)");
    });

    it("should book the room and withdraw the balance", async () => {
        const instance = await HotelRoom.deployed();
        const initialOwnerBalance = new web3.utils.BN(await web3.eth.getBalance(owner));

        await instance.bookRoom({ from: client, value: web3.utils.toWei("1", "ether") });

        const currentRoomStatus = await instance.currentRoomStatus();
        assert.equal(currentRoomStatus.toString(), '0', "The room should be OCCUPIED (0)");

        const finalOwnerBalance = new web3.utils.BN(await web3.eth.getBalance(owner));

        assert.isTrue(finalOwnerBalance.gt(initialOwnerBalance), "The owner should have more balance after the room was booked");
    });
});