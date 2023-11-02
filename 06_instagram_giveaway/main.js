
const fsPromises = require('fs').promises;
const path = require('path');

const dataArrays = [];
const userCountMap = {};

async function startProcessing() {
    console.time("Total time:");
    const uniqueUsersCount = await countUniqueUsers();
    const usersPresentInAllCount = await countUsersInAllFiles();
    const usersPresentInAtLeastTenCount = await countUsersInAtLeastTen();
    console.timeEnd("Total time:");

    console.log("Total unique users:", uniqueUsersCount);
    console.log("Users present in all 20 files:", usersPresentInAllCount);
    console.log("Users present in at least 10 files:", usersPresentInAtLeastTenCount);
}

async function countUniqueUsers() {
    const allUsers = [];
    const files = await fsPromises.readdir("files", "utf8");

    for (const file of files) {
        const fileData = await fsPromises.readFile(`files/${file}`, "utf-8");
        const usersArray = fileData.split("\n");

        allUsers.push(...usersArray);
        dataArrays.push(usersArray);
    }

    return new Set(allUsers).size;
}

async function countUsersInAllFiles() {
    dataArrays.forEach((array) => {
        const uniqueUserSet = new Set(array);
        uniqueUserSet.forEach((user) => {
            userCountMap[user] = (userCountMap[user] || 0) + 1;
        });
    });

    const usersPresentInAll = Object.keys(userCountMap).filter(
        (user) => userCountMap[user] === 20
    );
    return usersPresentInAll.length;
}

async function countUsersInAtLeastTen() {
    const usersPresentInTen = Object.keys(userCountMap).filter(
        (user) => userCountMap[user] >= 10
    );
    return usersPresentInTen.length;
}

startProcessing();
