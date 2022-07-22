// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract CryptoUser is ERC721, ERC721Enumerable {
    //owner of user's contract will hold the money
    address public owner;

    User[] public usersInArr;
    mapping(address => User) public users;

    struct User {
        address userAddress;
        uint256 indexInArr;
    }

    constructor() public ERC721("MetaUsers", "ETH") {
        owner = msg.sender;
    }

    // true = new user created, false = user was already in the system
    function createNewUser() public payable returns (bool) {
        for (uint256 i = 0; i < usersInArr.length; i++) {
            if (usersInArr[i].userAddress == msg.sender) {
                return true;
            }
        }
        // if user is not in the system (new user) he will recied money, if he is in the system nothing will happen
        User memory newUser = User(msg.sender, usersInArr.length);
        users[msg.sender] = newUser;
        usersInArr.push(newUser);
        if (msg.sender != owner) {
            // payable(owner).transfer(50);
            approve(msg.sender, 20 * 1e18);
            transferFrom(owner, msg.sender, 20 * 1e18);
        }
        return false;
    }

    // function buyLand(address sellerAddress, uint256 price) public payable {
    //     User memory seller = users[sellerAddress];
    //     payable(seller.userAddress).transfer(price);
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
