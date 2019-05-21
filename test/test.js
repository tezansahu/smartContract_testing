var MyMarket = artifacts.require("./MyMarket.sol");
const truffleAssert = require('truffle-assertions');

var contractInstance;
var itemID;



contract("MyMarket", async function(accounts){
    before(async () => {
        contractInstance = await MyMarket.deployed();
    })
    describe("success states", async () => {
        
        it("should add product 1", async () => {
            var name = "Prod1";
            var price = 200;
            var itemSeller = accounts[0];
    
            
            itemID = await contractInstance.addNewItem.call(name, price, {from: itemSeller});
            var tx = contractInstance.addNewItem(name, price, {from: itemSeller});
            // console.log(itemID.toNumber())
            var res = await contractInstance.getItem.call(itemID.toNumber())
    
            assert.equal(name, res["0"], "Name wasn't added properly");
            assert.equal(price, res["1"].toNumber(), "Price wasn't added properly");
            assert.equal(itemSeller, res["2"], "Seller wasn't added properly");
            assert.equal(res["3"].toNumber(), 0, "Status wasn't added properly");
    
        
        });
    
        it("should add product 2", async () => {
            var name = "Prod2";
            var price = 100;
            var itemSeller = accounts[0];
    
            
            itemID = await contractInstance.addNewItem.call(name, price, {from: itemSeller});
            var tx = contractInstance.addNewItem(name, price, {from: itemSeller});
            // console.log(itemID.toNumber())
            var res = await contractInstance.getItem.call(itemID.toNumber())
    
            assert.equal(name, res["0"], "Name wasn't added properly");
            assert.equal(price, res["1"].toNumber(), "Price wasn't added properly");
            assert.equal(itemSeller, res["2"], "Seller wasn't added properly");
            assert.equal(res["3"].toNumber(), 0, "Status wasn't added properly");
    
        
        });
    
        it("should remove product 1", async () => {
            itemID = 0;
            var tx = await contractInstance.removeItem(itemID);
            var removedId = tx.receipt.logs[0].args["0"].toNumber()
            assert.equal(removedId, itemID, "Incorrect item removed")
            var res = await contractInstance.getItem.call(itemID)
            assert.equal(res["3"].toNumber(), 2, "Item hasn't been removed correctly");
            // console.log(res);
        });
    
        it("should buy product 2", async () => {
            itemID = 1;
            var tx = await contractInstance.buyItem(itemID, {from: accounts[1], value: 100});
            var boughtId = tx.receipt.logs[0].args["0"].toNumber()
            assert.equal(boughtId, itemID, "Incorrect item bought")
            var res = await contractInstance.getItem.call(itemID)
            assert.equal(res["3"].toNumber(), 1, "Item hasn't been bought correctly");
        });
    })

    describe("failure states", async () => {
        it("should not remove product 2", async () => {
            itemID = 1;
            await truffleAssert.reverts(contractInstance.removeItem(itemID), "This item has already been purchased or removed");
        });
    })
    
});

