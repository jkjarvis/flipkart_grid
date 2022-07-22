const hre = require("hardhat");

async function main() {
  const Warranty = await hre.ethers.getContractFactory("Warranty");
  const warranty = await Warranty.deploy();

  await warranty.deployed();

  console.log("Warranty deployed to:", warranty.address);
  console.log(warranty);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
