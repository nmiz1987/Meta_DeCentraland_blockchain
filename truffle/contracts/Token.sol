// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CryptoToken is ERC20 {
    address public owner;

    constructor() public ERC20("NetanelCoin", "NMC") {
        owner = msg.sender;
        _mint(msg.sender, 100000 * 10**18);
    }

    function approve(address spender) external {
        _approve(owner, spender, 100 * 10**18);
        transferFrom(owner, spender, 100 * 10**18);
    }
}
