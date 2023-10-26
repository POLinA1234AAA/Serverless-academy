
# CLI Telegram Bot Sender

CLI Telegram Bot Sender is a command-line tool that allows you to easily send messages and photos to your Telegram bot.

## Installation

Install the necessary dependencies using npm:

```
npm install
```

## Configuration

Before using CLI Telegram Bot Sender, you need to configure your environment variables. Create a `.env` file in the project's root directory and specify your Telegram bot token and chat ID:

```
TOKEN_BOT=YOUR_TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID=YOUR_CHAT_ID
```

## Usage

CLI Telegram Bot Sender supports the following commands:

### Send a Message

```
npm run sendMessage 'Your message'
```

This command will send the specified message to your Telegram bot.

### Send a Photo

```
npm run sendPhoto 'path_to_photo.jpg'
```

This command will send a photo using the specified file path to your Telegram bot.

## Help

To view available commands and their parameters, use the `help` command or the `--help` argument:

```
npm run sendMessage --help
npm run sendPhoto --help
```
 users can run `npm run sendMessage --help` or `npm run sendPhoto --help` to see descriptions of the commands and their parameters.
