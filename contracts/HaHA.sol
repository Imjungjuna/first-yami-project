// Contract based on: https://docs.openzeppelin.com/contracts/4.x/governance
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract TimeLock is TimelockController {

    constructor (
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay,proposers,executors,admin)
    {}
}