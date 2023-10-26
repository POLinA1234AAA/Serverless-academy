const fs = require('fs');
const program = require('commander');
const { initTelegramBot, sendTelegramMessage, sendTelegramPhoto } = require('./msg/telegram');

// Initialize the Telegram bot using environment variables
initTelegramBot(process.env.TOKEN_BOT, process.env.TELEGRAM_CHAT_ID);

function initProgram() {
    program.version('1.0.0');

    program
        .command('message <message>')
        .alias('m')
        .description('Send a message to the Telegram Bot')
        .action(sendMessageToTelegram);

    program
        .command('photo <path>')
        .alias('p')
        .description('Send a photo to the Telegram Bot')
        .action(sendPhotoToTelegram);

    program.parse(process.argv);
}

function sendMessageToTelegram(message) {
    if (!message) {
        console.error('Error: Message content is required.');
        process.exit(1);
    }

    sendTelegramMessage(
        message,
        () => {
            console.log('Message sent successfully to the Telegram Bot!');
            process.exit(0);
        },
        (err) => {
            console.error('Error while sending a message to Telegram: ', err.message);
            process.exit(1);
        }
    );
}

function sendPhotoToTelegram(path) {
    if (!path) {
        console.error('Error: Photo path is required.');
        process.exit(1);
    }

    fs.readFile(path, (err, buffer) => {
        if (err) {
            console.error(`Error reading the photo file from ${path}:`, err);
            process.exit(1);
        }

        sendTelegramPhoto(
            buffer,
            () => {
                console.log('Photo sent successfully to the Telegram Bot!');
                process.exit(0);
            },
            (err) => {
                console.error(`Error while sending the photo to Telegram: `, err.message);
                process.exit(1);
            }
        );
    });
}

initProgram();
