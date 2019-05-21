var MyMarket = artifacts.require("./MyMarket.sol");

module.exports = function(deployer) {
  deployer.deploy(MyMarket);
};