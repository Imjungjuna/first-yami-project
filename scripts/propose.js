const fs = require("fs");
require("dotenv").config();

const {ethers,network} = require("hardhat");

const propose = async function(functionToCall,args,proposalDescription) {
    const governor = await ethers.getContractAt("GovernorContract","0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");
    const box = await ethers.getContractAt("Box","0xa513E6E4b8f2a923D98304ec87F64353C4D5C853");
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall,args);

    console.log(`Proposing ${functionToCall} on ${box.target} with ${args}`);
    console.log(`Proposal Description: \n ${proposalDescription}`);

    const proposeTx = await governor.propose(
        [box.target],
        [0],
        [encodedFunctionCall],
        proposalDescription
    );
    await proposeTx.wait(1);
    
    const proposalId = await governor.hashProposal(
        [box.target],
        [0],
        [encodedFunctionCall],
        ethers.keccak256(ethers.toUtf8Bytes(proposalDescription)));

    if (process.env.developmentChains.includes(network.name)) {
        await moveBlocks(process.env.VOTING_DELAY + 1);
    };

    const proposalState = await governor.state(proposalId);
    const proposalSnapShot = await governor.proposalSnapshot(proposalId);
    const proposalDeadline = await governor.proposalDeadline(proposalId);

    // the Proposal State is an enum data type, defined in the IGovernor contract.
  // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
    console.log(`Current Proposal State: ${proposalState}`);
  // What block # the proposal was snapshot
    console.log(`Current Proposal Snapshot: ${proposalSnapShot}`);
  // The block number the proposal voting expires
    console.log(`Current Proposal Deadline: ${proposalDeadline}`);

    let proposals = JSON.parse(fs.readFileSync(process.env.proposalsFile,"utf8"));

    proposals[network.config.chainId.toString()].push(proposalId.toString());
    fs.writeFileSync(process.env.proposalsFile,JSON.stringify(proposals));
}

propose(process.env.Func,[process.env.NEW_STORE_VALUE],process.env.PROPOSAL_DESCRIPTION)
    .then(()=>process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
});

async function moveBlocks(amount) {
    console.log("Moving Blocks...");
    
    for (let index = 0; index<amount; index++ ) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        });
    }
};