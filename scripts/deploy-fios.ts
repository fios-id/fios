import { ethers, run } from "hardhat";

async function main() {
  try {
    console.log("Deploying Fios contract to Fios Network...");

    const fios = await ethers.deployContract("Fios");
    await fios.waitForDeployment();

    // @ts-ignore - Not sure why types are not there
    const address = await fios.getAddress();
    console.log(`Fios deployed to: ${address}`);

    // Verify the contract
    console.log("Verifying contract...");
    try {
      await run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  } catch (error) {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
