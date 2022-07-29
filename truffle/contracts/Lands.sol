// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CryptoLand is ERC721, ERC721Enumerable {
    struct Land {
        string ownerName;
        address ownerID;
        string typeOfLand;
        uint256 price;
        string game;
        bool forSale;
    }

    Land[] public landsInArr;
    mapping(uint256 => bool) public lands;
    address payable public owner;
    uint256 public landsInArrIndex = 0;

    bool[] public landForSaleArr;

    constructor() public ERC721("MetaLand", "ETH") {
        owner = payable(msg.sender);
        // create 2500 lands
        // for (uint256 i = 0; i < 25; i++) {
        // create(100, i);
        // }
    }

    function create(uint256 size, uint256 offset) public {
        require(msg.sender == owner, "Only the owner can create new land");
        uint256 id = landsInArr.length;
        require(
            id <= 2500,
            "Meta DeCentraland has reached the limit of 10000 lands"
        ); //50 rows * 50 columns

        // a for loop to create the 2500 land in advence, didn't work due to low gas and block limit so i create function
        for (uint256 i = size * offset; i < size * (offset + 1); i++) {
            Land memory newLand = Land(
                "Netanel.Ltd",
                owner,
                "Real Estate",
                5,
                "https://numble-clone.vercel.app/",
                true
            );
            landsInArr.push(newLand); // to return the all data
            _safeMint(owner, i);
        }
    }

    function createOneLand(
        string memory _typeOfLand,
        bool _forSale,
        uint256 index
    ) public {
        require(msg.sender == owner, "Only the owner can create new land");
        uint256 id = landsInArr.length;
        require(
            id <= 2500,
            "Meta DeCentraland has reached the limit of 10000 lands"
        ); //50 rows * 50 columns
        // make sure that there aren't 2 NFTs the same!
        require(
            index >= id,
            "The land you are trying to create is already in the blockchain!"
        );

        if (index >= id) {
            string memory _game;
            uint256 _price;
            // make sure that roads and park are to expensive to purchase
            if (compareStrings(_typeOfLand, "Real Estate")) {
                _game = "https://numble-clone.vercel.app/";
                _price = 5; // default price
            } else {
                _game = "";
                _price = 999999999; // price to big to buy
                _forSale = false; // make sure that park and roads are not for sale
            }
            Land memory newLand = Land(
                "Netanel.Ltd",
                owner,
                _typeOfLand,
                _price,
                _game,
                _forSale
            );
            landsInArr.push(newLand); // to return the all data
            _mint(owner, index);
        }
    }

    function updateLand(
        uint256 _id,
        uint256 _price,
        string memory _game,
        bool _forSale
    ) public {
        Land storage currentLand = landsInArr[_id];
        // make sure that only Real Estate can be update!
        require(
            compareStrings(currentLand.typeOfLand, "Real Estate"),
            "Land is not Real Estate!"
        );
        currentLand.price = _price;
        currentLand.game = _game;
        currentLand.forSale = _forSale;
    }

    function buyLand(uint256 _id, string memory _ownerName) public payable {
        Land storage currentLand = landsInArr[_id];
        require(
            msg.sender != currentLand.ownerID,
            "The seller cant buy his own land"
        );
        address seller = currentLand.ownerID;
        currentLand.ownerName = _ownerName;
        currentLand.ownerID = msg.sender;
        currentLand.forSale = false;
        payable(seller).transfer(msg.value);
    }

    function compareStrings(string memory a, string memory b)
        public
        view
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

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
