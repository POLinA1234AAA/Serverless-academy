const fs = require('fs');

fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const originalData = JSON.parse(data);

    const transformedData = {};

    originalData.forEach(entry => {
        const userId = entry.user._id;
        const userName = entry.user.name;
        const vacationInfo = {
            startDate: entry.startDate,
            endDate: entry.endDate,
        };

        if (!transformedData[userId]) {
            transformedData[userId] = {
                userId: userId,
                userName: userName,
                vacations: [vacationInfo],
            };
        } else {
            transformedData[userId].vacations.push(vacationInfo);
        }
    });
    const result = Object.values(transformedData);

    const resultJSON = JSON.stringify(result, null, 2);


    fs.writeFile('res.json', resultJSON, 'utf8', err => {
        if (err) {
            console.error(err);
        } else {
            console.log('Transformed data has been saved to res.json');
        }
    });
});
