pragma solidity ^0.5.0;


contract MyMarket {

    // Track the state of the items, while preserving history
    enum ItemStatus {
        active,
        sold,
        removed
    }

    struct Item {
        string name;
        uint price;
        address seller;
        ItemStatus status;
    }

    event ItemAdded(string name, uint price, address seller);
    event ItemPurchased(uint itemID, address buyer, address seller);
    event ItemRemoved(uint itemID);
    event FundsPulled(address owner, uint amount);

    Item[] private _items;
    mapping (address => uint) public _pendingWithdrawals;

    modifier onlyIfItemExists(uint itemID) {
        require(_items[itemID].seller != address(0), "Item seller does not exist");
        _;
    }

    function addNewItem(string memory name, uint price) public returns (uint) {

        _items.push(Item({
            name: name,
            price: price,
            seller: msg.sender,
            status: ItemStatus.active
        }));

        emit ItemAdded(name, price, msg.sender);
        // Item is pushed to the end, so the lenth is used for
        // the ID of the item
        return _items.length - 1;
    }

    function getItem(uint itemID) public view onlyIfItemExists(itemID)
    returns (string memory, uint, address, uint) {

        Item storage item = _items[itemID];
        return (item.name, item.price, item.seller, uint(item.status));
    }

    function buyItem(uint itemID) public payable onlyIfItemExists(itemID) {

        Item storage currentItem = _items[itemID];

        require(currentItem.status == ItemStatus.active, "Item is not available");
        require(currentItem.price == msg.value, "Incorrect amount sent");

        _pendingWithdrawals[currentItem.seller] = msg.value;
        currentItem.status = ItemStatus.sold;

        emit ItemPurchased(itemID, msg.sender, currentItem.seller);
    }

    function removeItem(uint itemID) public onlyIfItemExists(itemID) {
        Item storage currentItem = _items[itemID];

        require(currentItem.seller == msg.sender, "You are not the seller of this product");
        require(currentItem.status == ItemStatus.active, "This item has already been purchased or removed");

        currentItem.status = ItemStatus.removed;

        emit ItemRemoved(itemID);
    }

    function pullFunds() public returns (bool) {
        require(_pendingWithdrawals[msg.sender] > 0, "No pending withdrawals");

        uint outstandingFundsAmount = _pendingWithdrawals[msg.sender];

        if (msg.sender.send(outstandingFundsAmount)) {
            emit FundsPulled(msg.sender, outstandingFundsAmount);
            return true;
        } else {
            return false;
        }
    }
}