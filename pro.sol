// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Pro {
    address public admin;

    struct Record {
        string name;
        uint score;
        bool eligible;
        bool exists;
        bool rewardGiven; // ✅ Added field
    }

    mapping(address => Record) public records;
    event RewardSent(address student, string name, uint score);
    event RewardGiven(address user, uint timestamp); // ✅ Added event

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function addRecord(address user, string memory name, uint score) public onlyAdmin {
        bool eligibility = score >= 80;
        records[user] = Record(name, score, eligibility, true, false); // ✅ Initialize `rewardGiven` to false
    }

    function checkMyEligibility() public view returns (bool, uint, string memory) {
        require(records[msg.sender].exists, "No record found for you");
        Record memory r = records[msg.sender];
        return (r.eligible, r.score, r.name);
    }

    function getRecord(address user) public view returns (Record memory) {
        return records[user];
    }

    function rewardStudent(address student) public onlyAdmin {
        require(records[student].exists, "Student not found");
        require(records[student].eligible, "Student not eligible");
        emit RewardSent(student, records[student].name, records[student].score);
    }

    function giveReward(address user) public onlyAdmin {
        require(records[user].exists, "User not found"); // ✅ Fixed: Use `records`
        require(records[user].eligible, "User not eligible"); // ✅ Fixed: Use `records`
        require(!records[user].rewardGiven, "Reward already given"); // ✅ Fixed: Use `records`

        records[user].rewardGiven = true; // ✅ Mark reward as given
        emit RewardGiven(user, block.timestamp);
    }
}