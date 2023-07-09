const { ethers } = require("hardhat");

const deployBox = async function() {
    const [deployer] = await ethers.getSigners();

    console.log("----------------------------------------------------");
    console.log("Deploying Box....");

    const Box = await ethers.deployContract("Box");
    await Box.waitForDeployment();
    console.log(`Box contract at ${Box.target}`);
    console.log(`Deployed by ${deployer.address}`);

    const timeLock = await ethers.getContractAt("TimeLock","0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
    const box = await ethers.getContractAt("Box",Box.target);

    const transferOwnerTx = await box.transferOwnership(
        timeLock.target
    );
    await transferOwnerTx.wait(1);
    console.log("You Dun It!!!!!!!!!!!!!!!");

}

deployBox()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });