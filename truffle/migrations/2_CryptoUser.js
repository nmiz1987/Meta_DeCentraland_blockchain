const CryptoUser = artifacts.require("CryptoUser");

module.exports = function (deployer) {
	deployer.deploy(CryptoUser);
};
