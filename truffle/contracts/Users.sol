// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "./Token.sol";

contract CryptoUser is ERC721, ERC721Enumerable {
    //owner of user's contract will hold the money
    address payable public owner;

    User[] public usersInArr;
    mapping(address => User) public users;

    struct User {
        address userAddress;
        uint256 indexInArr;
    }

    constructor() public ERC721("MetaUsers", "ETH") {
        owner = payable(msg.sender);
    }

    // true = new user created, false = user was already in the system
    function createNewUser() public returns (bool) {
        if (msg.sender != owner) {
            for (uint256 i = 0; i < usersInArr.length; i++) {
                if (usersInArr[i].userAddress == msg.sender) {
                    return false;
                }
            }
            // if user is not in the system (new user) he will recied money, if he is in the system nothing will happen
            User memory newUser = User(msg.sender, usersInArr.length);
            users[msg.sender] = newUser;
            usersInArr.push(newUser);
        }
        return true;
    }

    // function transferTokenToNewOwner() public payable {
    // if (createNewUser(msg.sender) == true) {
    // CryptoToken token = CryptoToken(tokenOwner);
    // token.approve(msg.sender, 5 * 10**18);
    // token.transferFrom(owner, msg.sender, 5 * 10**18);
    // }
    // }

    // helps keep track on the ID
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // helps keep track on the ID
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
