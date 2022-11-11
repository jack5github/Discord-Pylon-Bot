/* This file is used to store variables that the bot frequently needs to reference.
 * These variables are safe to share with others.
 */

import { getString } from './global';

/* Command prefixes - The symbols or phrases that the bot should respond to.
 * The bot can also respond to being mentioned.
 * These prefixes should not conflict with other Discord bots. List unusable prefixes below:
 * Dyno uses ?
 * FredBoat uses ;;
 * IdleRPG uses $
 * MEE6 uses !
 * SafetyAtLast uses &
 * Tatsu uses t!
 * \ may be used innocently when trying to get mention and emoji IDs
 */
export const COMMAND_PREFIXES = ['>', '%', '^', ':', ',', '.', 'pylon ', 'py '];

// Embed colour - The colour of embed content that the bot posts.
export const EMBED_COLOUR = 0xff4d00;
export const EMBED_COLOUR_ERROR = 0xff0000;

// Command cooldown - How long users should wait between commands in milliseconds.
export const COMMAND_COOLDOWN = 3000;

// Error timeout - How long users should be given to read error messages in milliseconds.
export const ERROR_TIMEOUT_MINIMUM = 5000;
export const ERROR_TIMEOUT_PER_CHAR = 50;

/* Command categories - Human-readable explanations of the different types of commands.
 * This is used by the help command to return info relevant to the user's query.
 * Command categories need to be defined or the help menu will fail to show commands inside them.
 */
export const COMMAND_CATEGORIES: any[] = [
  {
    name: 'chat',
    title: getString('category_chat_title'),
    description: getString('category_chat_desc'),
    longDescription: getString('category_chat_desc_long'),
  },
  {
    name: 'fun',
    title: getString('category_fun_title'),
    description: getString('category_fun_desc'),
    longDescription: getString('category_fun_desc_long'),
  },
  {
    name: 'gambling',
    title: getString('category_gambling_title'),
    description: getString('category_gambling_desc'),
    longDescription: getString('category_gambling_desc_long'),
  },
  {
    name: 'links',
    title: getString('category_links_title'),
    description: getString('category_links_desc'),
    longDescription: getString('category_links_desc_long'),
  },
  {
    name: 'tf2',
    title: getString('category_tf2_title'),
    description: getString('category_tf2_desc'),
    longDescription: getString('category_tf2_desc_long'),
  },
  {
    name: 'system',
    title: getString('category_system_title'),
    description: getString('category_system_desc'),
    longDescription: getString('category_system_desc_long'),
  },
  {
    name: 'default',
    title: getString('category_default_title'),
    description: getString('category_default_desc'),
  },
];
export const COMMAND_DEFAULT_CATEGORY = 'default';

/* Bot channel - The channel in which most of the bot's commands should be relegated to.
 * Attempting to use a restricted command outside this or the developer channel will warn the user.
 */
export const BOT_CHANNEL = '';

// Jazztronauts command settings.
export const JAZZ_OBJECTS_MINIMUM = 20; // The minimum number of objects that can spawn at once.
export const JAZZ_OBJECTS_MAXIMUM = 36; // The maximum number of objects that can spawn at once.
export const JAZZ_OUTSIDE_CHANCE = 0.5; // How often outside objects will appear out of 1.
export const JAZZ_REWARD_SMALL_MINIMUM = 2; // The base minimum number of points for small objects.
export const JAZZ_REWARD_SMALL_MAXIMUM = 4; // The base maximum number of points for small objects.
export const JAZZ_REWARD_LARGE_MINIMUM = 16; // The base minimum number of points for large objects.
export const JAZZ_REWARD_LARGE_MAXIMUM = 20; // The base maximum number of points for large objects.
export const JAZZ_REWARD_WORLD_MULTIPLIER = 0.5; // How much to multiply the points of an object if it is not a prop.
export const JAZZ_REWARD_BONUS_MULTIPLIER = 2; // How much to multiply the points of an object if it is a bonus.

// Steam Game default steamid64 - What steamid64 to use when none is provided. Get one from https://steamid.io
export const STEAMGAME_DEFAULT_STEAMID64 = '';

// Developer mode - Changes the bot behaviour depending on the specified channel.
export const DEV_CHANNEL = '';
