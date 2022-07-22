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

    constructor() public ERC721("MetaLand", "ETH") {
        owner = payable(msg.sender);
    }

    function createOneLand(
        string memory _typeOfLand,
        uint256 _price,
        bool _forSale
    ) public {
        require(msg.sender == owner, "Only the owner can create new land");
        uint256 id = landsInArr.length;
        require(
            id <= 10000,
            "Meta DeCentraland has reached the limit of 10000 lands"
        ); //100 rows * 100 columns
        string memory _game;

        // make sure that roads and park are to expensive to purchase
        if (compareStrings(_typeOfLand, "Real Estate")) {
            _game = "https://numble-clone.vercel.app/";
        } else {
            _game = "";
            _price = 999999999;
            _forSale = false;
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
        _mint(owner, id);
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
