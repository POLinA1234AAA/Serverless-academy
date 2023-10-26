const readline = require('readline');

const InputSort = (input) => {
    const words = [];
    const numbers = [];
    const array = input.split(" ");
    array.forEach((element) => {
        
        if (element.trim() !== "") {
            element = element.replace(/,/g, '');
            !isNaN(Number(element)) ? numbers.push(Number(element)) : words.push(element);
        }
    });

    return { words, numbers };
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getUserInput() {
    rl.question('Enter a few words or numbers separated by a space (or type "exit" to quit): ', (input) => {
        if (input.trim().toLowerCase() === 'exit') {
            rl.close();
            return;
        }

        const { words, numbers } = InputSort(input);
        displayOptions(words, numbers);
    });
}

function displayOptions(words, numbers) {
    rl.question(`
Choose an option:
1. Sort words alphabetically
2. Show numbers from lesser to greater
3. Show numbers from greater to lesser
4. Display words in ascending order by the number of letters in the word
5. Show only unique words
6. Show only unique values from the set of words and numbers
Enter the option number (1-6): `, (option) => {
        option = parseInt(option);
        switch (option) {
            case 1:
                if (hasNumbers(words)) {
                    console.log('Invalid input. Contains numbers. Please enter data again.');
                    getUserInput();
                } else {
                    console.log('Sorted words alphabetically:', words.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join(' '));
                }
                break;
            case 2:
                if (hasWords(numbers)) {
                    console.log('Invalid input. Contains words. Please enter data again.');
                    getUserInput(); 
                } else {
                    console.log('Numbers from lesser to greater:', numbers.sort((a, b) => a - b).join(' '));
                }
                break;
            case 3:
                if (hasWords(numbers)) {
                    console.log('Invalid input. Contains words. Please enter data again.');
                    getUserInput();
                } else {
                    console.log('Numbers from greater to lesser:', numbers.sort((a, b) => b - a).join(' '));
                }
                break;
            case 4:
                if (hasNumbers(words)) {
                    console.log('Invalid input. Contains numbers. Please enter data again.');
                    getUserInput();
                } else {
                    console.log('Words in ascending order by the number of letters:', words.sort((a, b) => a.length - b.length).join(' '));
                }
                break;
            case 5:
                if (hasWords(words)) {
                    const wordCount = {};
                    words.forEach(word => {
                        const lowercaseWord = word.toLowerCase();
                        wordCount[lowercaseWord] = (wordCount[lowercaseWord] || 0) + 1;
                    });
                    const uniqueWords = words.filter(word => {
                        const lowercaseWord = word.toLowerCase();
                        return wordCount[lowercaseWord] === 1;
                    });
                    console.log('Unique words:', uniqueWords.join(' '));
                } else {
                    console.log('Invalid input. Words are required for this option.');
                    getUserInput(); 
                }
                break;
            case 6:
                const uniqueValues = [];
                for (const value of words.concat(numbers)) {
                    if (words.concat(numbers).filter((v) => v === value).length === 1) {
                        uniqueValues.push(value);
                    }
                }
                console.log('Unique values:', uniqueValues.join(' '));
                break;
            default:
                console.log('Invalid option. Please enter a number from 1 to 6.');
                getUserInput(); 
        }
    });
}

function hasWords(arr) {
    return arr.some((element) => isNaN(Number(element)));
}

function hasNumbers(arr) {
    return arr.some((element) => !isNaN(Number(element)));
}

getUserInput();
