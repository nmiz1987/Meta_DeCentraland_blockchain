const Meta = artifacts.require("./Meta.sol");

contract("Meta", () => {
	let contract;
	before(async () => {
		contract = await Meta.deployed();
	});

	it("should deploy", async () => {
		assert.notEqual(contract, "");
	});

	it("..get's minted and added", async () => {
		const result = await contract.mint("Netanel.Ltd");
		let land = await contract.lands(0);
		assert(land, "Netanel.Ltd");
	});
});
