const fs = require("fs");
const { network, ethers } = require("hardhat");
require("dotenv").config();

const index = 1;

async function main(proposal_Index) {
    const proposals = await JSON.parse(fs.readFileSync(process.env.proposalsFile,"utf8"));
    const proposalId = proposals[network.config.chainId][proposal_Index];
    // `support=bravo` refers to the vote options 0 = Against, 1 = For, 2 = Abstain, as in `GovernorBravo`
    // 0 = Against(반대), 1 = For(찬성), 2 = Abstain(기권)
    const voteWay = 1;
    const governor = await ethers.getContractAt("GovernorContract","0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");
    const reason = "I love lucky Sevven!!";
    const asset = await governor.state(proposalId);
    console.log(`sf ${asset}`);
    const voteTxResponse = await governor.castVoteWithReason(proposalId,voteWay,reason);
    await voteTxResponse.wait(1);

    if(process.env.developmentChains.includes(network.name)) {
        await moveBlocks(process.env.VOTING_PERIOD + 1);
    }
    console.log("Voted!! Ready to Go!!");
};

main(index)
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