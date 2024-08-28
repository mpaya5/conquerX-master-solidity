const VendingMachine = artifacts.require("VendingMachine");

contract("VendingMachine", (accounts) => {
  it("should add a product", async () => {
    const instance = await VendingMachine.deployed();
    await instance.addProduct("Candy", 100, 1, { from: accounts[0] });
    const snacks = await instance.getAllSnacks();
    assert.equal(snacks[0].name, "Candy", "The fist product should be Candy");
  });

  it("should restock a product", async () => {
    const instance = await VendingMachine.deployed();
    await instance.restockProduct("Candy", 50, { from: accounts[0] });
    const snacks = await instance.getAllSnacks();
    assert.equal(snacks[0].quantity, 150, "The Candy's quantity should be 150");
  });
});
