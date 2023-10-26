const TelegramBot = require('node-telegram-bot-api');

let telegramBot = null;

function initTelegramBot(token, chatId) {
    telegramBot = new TelegramBot(token, { polling: true });
    process.env.TELEGRAM_CHAT_ID = chatId;
}

function sendTelegramMessage(message, successCallback, errorCallback) {
    telegramBot.sendMessage(process.env.TELEGRAM_CHAT_ID, message)
        .then(successCallback)
        .catch(errorCallback);
}

function sendTelegramPhoto(buffer, successCallback, errorCallback) {
    telegramBot.sendPhoto(process.env.TELEGRAM_CHAT_ID, buffer)
        .then(successCallback)
        .catch(errorCallback);
}

module.exports = {
    initTelegramBot,
    sendTelegramMessage,
    sendTelegramPhoto
};
