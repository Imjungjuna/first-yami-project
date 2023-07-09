const { ethers } = require("hardhat");

const deployGovernanceToken = async function () {
  const [deployer] = await ethers.getSigners();
  
  console.log("----------------------------------------------------");
  console.log("Deploying GovernanceToken...");
  
  const governanceToken = await ethers.deployContract("GovernanceToken");
  console.log(governanceToken);
  console.log(`GovernanceToken at ${governanceToken.target}`);

  console.log(`Delegating to ${deployer.address}`);
  await delegate(governanceToken.target, deployer.address);
  console.log("Delegated!");
};

const delegate = async (governanceTokenAddress, delegatedAccount) => {
  const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress);
  const transactionResponse = await governanceToken.delegate(delegatedAccount);
  await transactionResponse.wait(1);
  console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`);
};

deployGovernanceToken()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });
