# Jack5's Discord Bot (Pylon-based)

Hi there! My name is Jack5 and I'm building this bot for a few communities on Discord. I've been using Pylon as my Discord bot for several years. Contact me if you would like to report bugs, suggest features or even check out my stuff. Cheers!

## Managing the bot

If you are not knowledgeable about code and need some help finding your way around, here are the important files to know about:

- `config.ts` - Quite a few easy-to-adjust settings are located here, including prefixes the bot uses, embed colours, cooldown times, economy settings, and the categories found in the help menus.
- `lang.ts` - If you feel you need to change any of the text the bot prints out, you can do so here.
- `secrets.ts` - This file is where API keys are stored. You will need to create this file if it does not already exist.
- `commands/`- Every command that the bot is capable of is located in this folder.

## Creating new commands

You are free to lift code from the other commands and use them in your own brand new command.

Please note that unless you add your new command's file into `main.ts`, nothing will happen when you try to run it. Additionally, you must add new help categories to `config.ts` or else they won't show up in the help menus.

The inner workings of all commands can be found in the `global.ts` file, which contains critical functions that make the whole bot work as a single, seamless package.
