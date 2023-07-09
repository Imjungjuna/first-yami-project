require('dotenv').config();
const {ethers} = require("hardhat")

const setUpContract = async function() {
    const [deployer] = await ethers.getSigners();
  
    const timeLock = await ethers.getContractAt("TimeLock","0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");

    console.log("Setting up Roles...");

    const proposerRole = "0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1"
    const executorRole = "0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63"
    const adminRole = "0x5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5"

    const proposerTx = await timeLock.grantRole(proposerRole,"0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"); // goveror contract
    await proposerTx.wait(1);
    console.log("Proposer granted!")
    const executorTx = await timeLock.grantRole(executorRole, process.env.ADDRESS_ZERO);
    await executorTx.wait(1);
    console.log("Executor granted!")
    const revokeTx = await timeLock.revokeRole(adminRole,deployer.address);
    await revokeTx.wait(1);
    console.log("Admin revoked!")
}

setUpContract()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });