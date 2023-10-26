import inquirer from "inquirer";
import fs from 'fs';

let users = [];

// Func that loads users from the database
const loadUsers = () => {
    try {
        const data = fs.readFileSync('db.txt', 'utf8');
        if (data) {
            users = JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
};

// Func to save users to the database
const saveUsers = () => {
    try {
        fs.writeFileSync('db.txt', JSON.stringify(users, null, 2));
        console.log('User data has been saved to db.txt.');
    } catch (error) {
        console.error('Error saving users:', error);
    }
};

// Func to add a user
const addUser = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the user`s name (press Enter to exit):',
        },
    ])
        .then((answers) => {
            const name = answers.name.trim();

            if (name) {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'gender',
                        message: 'Select the user`s gender:',
                        choices: ['Male', 'Female'],
                    },
                    {
                        type: 'input',
                        name: 'age',
                        message: 'Enter the user`s age:',
                        validate: (input) => {
                            const age = parseInt(input);
                            if (input === '' || isNaN(age)) {
                                return "Enter a valid age";
                            }
                            return true;
                        }
                    },
                ])
                    .then((userData) => {
                        const user = {
                            name: name,
                            gender: userData.gender,
                            age: parseInt(userData.age)
                        };
                        users.push(user);
                        saveUsers();
                        addUser();
                    });
            } else {
                searchUser();
            }
        });
};

// Func to search for a user
const searchUser = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'search',
            message: 'Search for a user by name?',
        }
    ])
        .then((answer) => {
            if (answer.search) {
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'searchName',
                        message: 'Enter the name to search for:',
                    }
                ])
                    .then((searchValue) => {
                        const foundUsers = users.filter(user =>
                            user.name.toLowerCase().includes(searchValue.searchName.toLowerCase())
                        );

                        if (foundUsers.length === 0) {
                            console.log('User not found in the database.');
                        } else {
                            console.log('Found users:', foundUsers);
                        }
                        restartProgram();
                    });
            } else {
                restartProgram();
            }
        });
};

// Func to restart the program
const restartProgram = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'restart',
            message: 'Do you want to perform another operation?',
        }
    ])
        .then((answer) => {
            if (answer.restart) {
                startProgram();
            } else {
                console.log('Goodbye!');
            }
        });
};


const startProgram = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is your name? (Press Enter to find a user in the DB)',
        }
    ])
        .then((nameAnswer) => {
            const name = nameAnswer.name.trim();
            if (name) {
                addUser();
            } else {
                searchUser();
            }
        })
        .catch((error) => {
            console.error('Something went wrong:', error);
        });
};


loadUsers();
startProgram();
