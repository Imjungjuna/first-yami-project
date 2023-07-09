require('dotenv').config();
const { ethers } = require("hardhat")


const deployGovernorContract = async function()  { 
    const [deployer] = await ethers.getSigners();

    console.log("----------------------------------------------------");
    console.log("Deploying Governor...");

    const MyGovernor = await ethers.deployContract("GovernorContract",
    ["0x5FbDB2315678afecb367f032d93F642f64180aa3", // GovernanceToken.address
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // TimeLock.address
    process.env.VOTING_DELAY,
    process.env.VOTING_PERIOD,
    process.env.PROPOSAL_THRESHOLD,
    process.env.QUORUM_PERCENTAGE]);

    console.log(`Governor contract at ${MyGovernor.target}`);
    console.log(`Deployed by ${deployer.address}`);
 }
 
 deployGovernorContract()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });