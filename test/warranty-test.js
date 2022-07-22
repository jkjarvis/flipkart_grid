const { expect } = require("chai");

describe("Warranty", function () {
  it("should create and transfer warranty tokens", async function () {
    const Warranty = await ethers.getContractFactory("Warranty");
    const warranty = await Warranty.deploy();
    await warranty.deployed();

    const warrantyContractAddress = warranty.address;

    // console.log(warranty);

    // console.log("contractAddress: ", warrantyContractAddress);

    const [firstAddress, secondAddress] = await ethers.getSigners();

    // console.log("first: ", firstAddress);
    // const grantMinterRole = await warranty
    //   .connect(firstAddress)
    //   .grantMinterRole(secondAddress);

    await warranty.connect(firstAddress).grantMinterRole(secondAddress.address);

    const role = await warranty.connect(secondAddress).checkRole();
    console.log("Role: ", role);

    const myNFTs = await warranty.fetchMyNFTs();
    console.log("MyNFTS: ", myNFTs);
  });
});
