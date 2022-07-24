const CryptoToken = artifacts.require("CryptoToken");

module.exports = function (deployer) {
	deployer.deploy(CryptoToken);
};
