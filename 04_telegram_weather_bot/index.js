
const BOT_TOKEN = ''; // Replace with Telegram bot token
const OPENWEATHER_API_KEY = ''; // Replace with  OpenWeather API key

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const conversationState = {};

const startButton = {
    reply_markup: {
        keyboard: [['Start']],
        resize_keyboard: true,
        one_time_keyboard: true,
    },
};

const intervalButtons = {
    reply_markup: {
        keyboard: [['Every 3 Hours', 'Every 6 Hours']],
        resize_keyboard: true,
        one_time_keyboard: true,
    },
};

const initialOptions = {
    reply_markup: {
        keyboard: [['Change City', 'Exit']],
        resize_keyboard: true,
        one_time_keyboard: true,
    },
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to Weather report bot!', startButton);
    conversationState[chatId] = { step: 'start' };
});

bot.onText(/Start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Please enter the name of the city:');
    conversationState[chatId] = { step: 'city' };
});

bot.onText(/Exit/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'You have exited the conversation.', startButton);
    delete conversationState[chatId];
});

bot.onText(/Change City/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Please enter a new city name:');
    conversationState[chatId] = { step: 'city' };
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (conversationState[chatId]) {
        handleConversation(chatId, text);
    } else if (text === 'Start') {
        bot.sendMessage(chatId, '');
        conversationState[chatId] = { step: 'city' };
    }
});

function handleConversation(chatId, text) {
    const state = conversationState[chatId];
    switch (state.step) {
        case 'city':
            state.selectedCity = text;
            state.step = 'interval';
            bot.sendMessage(chatId, `City set to ${text}. Select forecast interval:`, intervalButtons);
            break;
        case 'interval':
            const intervalHours = text === 'Every 6 Hours' ? 6 : 3;
            getWeatherForecast(chatId, state.selectedCity, intervalHours);
            state.step = 'post-forecast';
            break;
        case 'post-forecast':
            bot.sendMessage(chatId, 'Options:', initialOptions);
            break;
    }
}


function getWeatherForecast(chatId, city, intervalHours) {
  
    const numberOfForecasts = Math.ceil(24 / intervalHours);


    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`)
        .then((response) => {
            const forecasts = response.data.list;
            const currentTime = new Date();
            let message = `Weather forecast for ${city} for the next 24 hours (every ${intervalHours} hours):\n`;

            for (let i = 0; i < numberOfForecasts; i++) {
                const forecastTime = new Date(currentTime.getTime() + i * intervalHours * 3600000);
                const closestForecast = forecasts.reduce((acc, forecast) => {
                    const forecastTimeDiff = Math.abs(forecastTime - new Date(forecast.dt * 1000));
                    const accTimeDiff = Math.abs(new Date(acc.dt * 1000) - forecastTime);
                    return forecastTimeDiff < accTimeDiff ? forecast : acc;
                });

                const temperature = closestForecast.main.temp;
                const description = closestForecast.weather[0].description;
                const timeString = forecastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateString = forecastTime.toLocaleDateString();
                message += `${dateString} ${timeString}: ${description}, Temperature: ${temperature}°C\n`;
            }

       
            bot.sendMessage(chatId, message, initialOptions); 

            // Remove the conversation state
            delete conversationState[chatId];
        })
        .catch((error) => {
            console.error(error);
            bot.sendMessage(chatId, 'Failed to fetch weather data. Please try again later.');
        });
}
