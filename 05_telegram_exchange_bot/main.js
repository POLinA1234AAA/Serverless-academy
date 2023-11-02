const TelegramBot = require('node-telegram-bot-api');
const NodeCache = require('node-cache');
const axios = require('axios');

const bot = new TelegramBot('6750098481:AAFzMQwfRXnDf_vid6CwX1AKitESPE-gr8c', { polling: true });
const cache = new NodeCache({ stdTTL: 60 });

const PRIVATBANK_API_URL = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
const MONOBANK_API_URL = 'https://api.monobank.ua/bank/currency';

// Define the main menu keyboard
const mainMenuKeyboard = {
    keyboard: [
        [{ text: 'USD Exchange Rate' }, { text: 'EUR Exchange Rate' }],
        [{ text: 'Exit' }],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome! Please select the currency:', { reply_markup: mainMenuKeyboard });
});

bot.onText(/(USD Exchange Rate|EUR Exchange Rate|Exit)/, (msg, match) => {
    const chatId = msg.chat.id;
    const selectedOption = match[1];

    switch (selectedOption) {
        case 'USD Exchange Rate':
            getUSDExchangeRate(chatId);
            break;

        case 'EUR Exchange Rate':
            getEURExchangeRate(chatId);
            break;

        case 'Exit':
            exitConversation(chatId);
            break;
    }
});

function getUSDExchangeRate(chatId) {
    const cachedData = cache.get('USD');

    if (cachedData) {
        bot.sendMessage(chatId, `USD Exchange Rate: ${cachedData}`, { reply_markup: mainMenuKeyboard });
    } else {
        axios.get(PRIVATBANK_API_URL)
            .then((response) => {
                const usdRate = response.data[0].buy;

                if (usdRate) {
                    cache.set('USD', usdRate);
                    bot.sendMessage(chatId, `USD Exchange Rate: ${usdRate}`, { reply_markup: mainMenuKeyboard });
                } else {
                    bot.sendMessage(chatId, 'Unable to fetch USD exchange rate. Please try again later.', {
                        reply_markup: mainMenuKeyboard,
                    });
                }
            })
            .catch((error) => {
                console.error('Error fetching USD exchange rate:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the exchange rate.', {
                    reply_markup: mainMenuKeyboard,
                });
            });
    }
}

function getEURExchangeRate(chatId) {
    const cachedData = cache.get('EUR');

    if (cachedData) {
        bot.sendMessage(chatId, `EUR Exchange Rate: ${cachedData}`, { reply_markup: mainMenuKeyboard });
    } else {
        axios.get(MONOBANK_API_URL)
            .then((response) => {
                const eurRate = response.data[0].rateSell;

                if (eurRate) {
                    cache.set('EUR', eurRate);
                    bot.sendMessage(chatId, `EUR Exchange Rate: ${eurRate}`, { reply_markup: mainMenuKeyboard });
                } else {
                    bot.sendMessage(chatId, 'Unable to fetch EUR exchange rate. Please try again later.', {
                        reply_markup: mainMenuKeyboard,
                    });
                }
            })
            .catch((error) => {
                console.error('Error fetching EUR exchange rate:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the exchange rate.', {
                    reply_markup: mainMenuKeyboard,
                });
            });
    }
}

function exitConversation(chatId) {
    bot.sendMessage(chatId, 'You have exited the conversation. If you need assistance in the future, type /start.');
}
