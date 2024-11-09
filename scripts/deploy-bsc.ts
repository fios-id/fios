import { ethers, run } from "hardhat";

async function main() {
  try {
    console.log("Deploying Fios contract to BSC Testnet...");

    const fios = await ethers.deployContract("Fios");
    await fios.waitForDeployment();

    // @ts-ignore
    const address = await fios.getAddress();
    console.log(`Fios deployed to: ${address}`);

    // // Wait for more block confirmations on BSC
    // console.log("Waiting for block confirmations...");
    // await fios.deploymentTransaction()?.wait(3);

    // // Verify the contract on BSCScan
    // console.log("Verifying contract on BSCScan...");
    // try {
    //   await run("verify:verify", {
    //     address: address,
    //     constructorArguments: [],
    //     network: "bscTestnet",
    //   });
    //   console.log("Contract verified successfully on BSCScan!");
    // } catch (error) {
    //   console.error("Error verifying contract:", error);
    // }
  } catch (error) {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
