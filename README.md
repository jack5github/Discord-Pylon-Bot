# Jack5's Discord Bot (Pylon-based)

Hi there! My name is Jack5 and I'm building this bot for a few communities on Discord. I've been using Pylon as my Discord bot of choice for several years. Feel free to contribute code if you would like to add to the growing number of functions, or you can contact me to report bugs and suggest features!

## Managing the bot

If you are not knowledgeable about code and need some help finding your way around, here are the important files to know about:

- `config.ts` - Quite a few easy-to-adjust settings are located here, including prefixes and channels the bot uses, embed colours, cooldown times, and the categories found in the help menus.
- `lang.ts` - If you feel you need to change any of the text the bot prints out, you can do so here. Turn responses in arrays to have the bot reply with a random one!
- `secrets.ts` - This file is where your secret API keys are stored, used for commands that need to speak with servers which require authentication.
- `commands/`- Every command the bot is capable of is located in this folder. Look in here if you're ready to dive into the coding of the bot!

## Creating new commands

You are free to lift code from the other commands and use them in your own brand new command while running this flavour of Pylon. Please note that unless you add your new command's file into `main.ts`, nothing will happen when you try to run it. Additionally, you must add new help categories to `config.ts` or else they won't show up in the help menus.

The inner workings of all commands can be found in the `global.ts` file, which contains critical functions that make the whole bot work as a single, seamless package.
