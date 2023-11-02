const axios = require('axios');
const apiEndpoints = require('./endpoint');

const maxRetries = 3;

async function sendRequest(endpoint) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const response = await axios.get(endpoint);
            return response.data;
        } catch (error) {
            console.error(`[Retry ${retries + 1}] Error for ${endpoint}: ${error.message}`);
            retries++;
        }
    }
    console.error(`[Fail] ${endpoint}: The endpoint is unavailable`);
    return null;
}

async function main() {
    let trueCount = 0;
    let falseCount = 0;

    for (const endpoint of apiEndpoints) {
        const data = await sendRequest(endpoint);

        if (data) {
            if (data.hasOwnProperty('isDone')) {
                console.log(`[Success] ${endpoint}: isDone - ${data.isDone}`);
                if (data.isDone === true) {
                    trueCount++;
                } else {
                    falseCount++;
                }
            } else {
                console.log(`[Fail] ${endpoint}: 'isDone' key not found`);
            }
        }
    }

    console.log(`Found True values: ${trueCount}`);
    console.log(`Found False values: ${falseCount}`);
}

main();
