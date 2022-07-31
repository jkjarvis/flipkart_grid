// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Warranty is ERC721, ERC721URIStorage, ERC721Burnable, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    address owner;
    uint totalRepairs=0;

    mapping(uint256 => Product) idToProduct;
    mapping(address => Role) addressToRole;
    mapping(uint256 => Repair) idToRepair;
    mapping(string => uint256) serialNumberToTokenId;

    enum Role{
        USER,
        MINTER,
        ADMIN
    }

    struct Product{
        uint256 tokenId;
        string serialNumber;
        address owner;
        address seller;
        uint warrantyExpiry;
        address minter;
    }

    struct Repair{
        uint256 tokenId;
        uint date;
        string description;
    }

    constructor() ERC721("Warranty", "WRT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        owner = msg.sender;
        addressToRole[msg.sender]=Role.ADMIN;
    }

    function grantMinterRole(address to)public onlyRole(DEFAULT_ADMIN_ROLE){
        _grantRole(MINTER_ROLE, to);
        addressToRole[to] = Role.MINTER;
    }

    function checkRole()public view returns(Role){
        return addressToRole[msg.sender];
    }

    function safeMint(address to, string memory uri, string memory serialNumber, uint warrantyDays) public onlyRole(MINTER_ROLE) returns(uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        uint expiry = block.timestamp + warrantyDays*86400;
        createProduct(tokenId, serialNumber, to, expiry);
        addressToRole[to] = Role.USER;
        serialNumberToTokenId[serialNumber]=tokenId;

        return tokenId;
    }

    function makeRepair(string memory serialNumber, string memory description)public onlyRole(MINTER_ROLE) returns(Repair memory){
        uint256 tokenId = serialNumberToTokenId[serialNumber];
        Product storage product = idToProduct[tokenId];
        require(product.minter == msg.sender, "You are not the original minter for this NFT, Only minters can make repairs");
        idToRepair[tokenId] = Repair(
            tokenId,
            block.timestamp,
            description
        );
        totalRepairs+=1;
        return idToRepair[tokenId];
    }

    function checkRepairs(uint256 tokenId)public view returns(Repair[] memory){
        Product storage product = idToProduct[tokenId];
        require(product.minter == msg.sender || product.owner == msg.sender, "Only owners or original minters can check repairs");


        uint repairCount = 0;
        uint currentIndex = 0;


        for(uint i=0; i< totalRepairs; i++){
            if(idToRepair[i].tokenId == tokenId){
                repairCount+=1;
            }
        }

        Repair[] memory repairs = new Repair[](repairCount);

        for (uint i = 0; i < totalRepairs; i++) {
        if (idToRepair[i].tokenId == tokenId) {
                uint currentId = i;
                Repair storage currentRepair = idToRepair[currentId];
                repairs[currentIndex] = currentRepair;
                currentIndex += 1;
        }
      }

      return repairs;
    }

    function checkWarranty(uint256 tokenId)public view returns(uint){
        Product storage product = idToProduct[tokenId];
        require(product.minter == msg.sender || product.owner == msg.sender, "Only owners or original minters can check warranty");
        return product.warrantyExpiry;
    }

    function createProduct(uint256 tokenId, string memory serialNumber, address buyer, uint expiry )private onlyRole(MINTER_ROLE){
        idToProduct[tokenId]= Product(
            tokenId,
            serialNumber,
            buyer,
            msg.sender,
            expiry,
            msg.sender
        );

    }

    function resell(uint256 tokenId, address to)public payable {
        Product memory product = idToProduct[tokenId];
        require(product.owner == msg.sender);
        product.seller = msg.sender;
        product.owner = to;
        idToProduct[tokenId]=product;

        _transfer(msg.sender, to, tokenId);

    }

    function fetchMyNFTs()public  returns (Product[] memory){
        uint totalProducts = _tokenIdCounter.current();
        uint productCount = 0;
        uint currentIndex = 0;

        for(uint i=0; i< totalProducts; i++){
            if(idToProduct[i].owner == msg.sender){
                productCount+=1;
            }
        }

        Product[] memory products = new Product[](productCount);

        for (uint i = 0; i < totalProducts; i++) {
        if (idToProduct[i].owner == msg.sender) {
                uint currentId = i;
                Product storage currentProduct = idToProduct[currentId];

                if(currentProduct.warrantyExpiry < block.timestamp){
                    _burn(currentProduct.tokenId);
                    continue;
                }
                products[currentIndex] = currentProduct;
                currentIndex += 1;
        }
      }

      return products;


    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}