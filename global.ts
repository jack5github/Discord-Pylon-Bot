/* This file contains important bottom-level variables and functions used by bot commands.
 * Exports may be called by other files with an import statement.
 * Anything not used outside of this file should not be exported.
 */

import * as CFG from './config';
import * as LANG from './lang';

// Command handler - The foundation for new commands.
const COMMAND_HANDLER = new discord.command.CommandGroup({
  defaultPrefix: getDefaultPrefix(),
  additionalPrefixes: getAllPrefixes(),
  mentionPrefix: true, // The bot will respond to being mentioned.
});

// Command info - The foundation for new help topics.
const COMMAND_INFO: any[] = [];

/* Create command - Use this function when creating a new command, it streamlines the whole process.
 *
 * The following parameters are used by the command logic:
 *
 * name - Specifies the primary name of the command.
 * aliases - Specifies optional names that the command also runs for.
 * permissions - Specifies optional permissions the user must have.
 * run - The function that will be run if the command can run in a non-developer channel.
 * runDev - An optional function that will be run if in a developer channel.
 *
 * The following parameters are used only for populating the help menu:
 *
 * showInHelp - Whether to show the command in the help menus (defaults to true).
 * restrictChannel - Whether to prevent the command from being used in most channels (defaults to false).
 * devOnly - Whether to only show the command in the help menus if in a developer channel (defaults to false).
 * category - Specifies what category of commands it belongs to.
 * description - The description of the command as seen on its category page.
 * longDescription - The description of the command as seen on its own page.
 * args - Descriptions of the arguments the command accepts:
 * |_ name - The name of the argument.
 * |_ description - The description of the argument as seen on the command page.
 */
export async function createCommand(items: any) {
  if (items.name != null) {
    // Create the command.
    if (items.aliases == null) {
      items.aliases = [];
    }
    COMMAND_HANDLER.on(
      { name: items.name, aliases: items.aliases },
      (args) => ({
        input: args.stringListOptional(),
      }),
      async (message: discord.GuildMemberMessage, { input }) => {
        // Check the user's permissions if there are requirements.
        let allPermitted = true;
        if (items.permissions != null) {
          await items.permissions.forEach(
            async (permission: discord.Permissions) => {
              let permitted = await doesUserHavePermission(message, permission);
              if (!permitted) {
                allPermitted = false; // The user does not have one of the permissions, they cannot use this command.
              }
            }
          );
        }
        // Run the command if the user has permission to do so and they are not timed out.
        if (allPermitted) {
          let timedOut = await isUserTimedOut(message);
          if (!timedOut) {
            // Run the command if it allows itself to be run in the current channel.
            if (
              items.restrictChannel == null ||
              !items.restrictChannel ||
              message.channelId == CFG.BOT_CHANNEL ||
              message.channelId == CFG.DEV_CHANNEL
            ) {
              if (message.channelId != CFG.DEV_CHANNEL) {
                // Run the command normally outside of the developer channel.
                if (items.run != null) {
                  await items.run(message, input);
                }
              } else if (items.runDev != null) {
                // Run the command in developer mode since a developer version exists.
                await items.runDev(message, input);
              } else if (items.run != null) {
                // Run the command normally despite being in the developer channel.
                await items.run(message, input);
              }
            } else {
              // The current channel is not acceptable for this command, reply with an error.
              createErrorEmbed(message, getString('incorrect_channel'));
            }
          }
        } else {
          // The user does not have the required permissions, reply with an error.
          createErrorEmbed(message, getString('no_permission'));
        }
      }
    );
    // Create the help topic for the command.
    if (items.showInHelp == null) {
      items.showInHelp = true;
    }
    if (items.restrictChannel == null) {
      items.restrictChannel = false;
    }
    if (items.devOnly == null) {
      items.devOnly = false;
    }
    if (items.featured == null) {
      items.featured = false;
    }
    if (items.showInHelp) {
      if (items.category == null) {
        items.category = CFG.COMMAND_DEFAULT_CATEGORY;
      }
      COMMAND_INFO.push({
        name: items.name,
        category: items.category,
        description: items.description,
        aliases: items.aliases,
        longDescription: items.longDescription,
        args: items.args,
        restrictChannel: items.restrictChannel,
        devOnly: items.devOnly,
        featured: items.featured,
      });
    }
  }
}

// Get command help topics and categories - Used when listing help topics.
export function getCommandHelpTopics() {
  return COMMAND_INFO;
}
export function getCommandCategories() {
  return CFG.COMMAND_CATEGORIES;
}

// Get string - Retrieves text from the language file.
export function getString(stringName: string) {
  let dictionSearch = ([key, value]: [string, unknown]) => key == stringName;
  let diction = Object.entries(LANG.dictionary).find(dictionSearch);
  if (diction != undefined) {
    try {
      if (typeof diction[1] === 'string') {
        return diction[1] as string;
      } else if (typeof diction[1] === 'object') {
        // Randomise which string to send if there is an array of strings.
        let array: any = diction[1] as object;
        return array[Math.floor(Math.random() * array.length)];
      }
    } catch (err) {} // Required to stop "Cannot read properties of undefined (reading 'length')" error.
  }
  return '[' + stringName + ' missing, notify admin]';
}

// Default command - Run when no command could be found with the given name.
COMMAND_HANDLER.default(
  (args) => ({
    input: args.stringListOptional(),
  }),
  async (message, { input }) => {
    // Only show an error in the developer channel for now
    if (message.channelId == CFG.DEV_CHANNEL && input != null) {
      let error = getString;
      createErrorEmbed(
        message,
        getString('unknown_cmd').replaceAll('%1', input[0].toLowerCase())
      );
    }
  }
);

// Create embed - Builds the foundation for fancy embed content in a message.
export function createEmbed() {
  return new discord.Embed({
    color: CFG.EMBED_COLOUR,
  });
}

// Reply with error - Used when a command encounters a miscellaneous problem.
// Requires the original message and the content to display on the error.
export async function createErrorEmbed(
  message: discord.GuildMemberMessage,
  content: string
) {
  // Set how long the error message lasts for
  let timeout = CFG.ERROR_TIMEOUT_PER_CHAR * content.length;
  if (timeout < CFG.ERROR_TIMEOUT_MINIMUM) {
    timeout = CFG.ERROR_TIMEOUT_MINIMUM;
  } else if (timeout > 29000) {
    timeout = 29000;
  }
  // Create and send the error message
  let embed = createEmbed();
  embed.setColor(CFG.EMBED_COLOUR_ERROR);
  embed.setDescription(content);
  message.reply(embed).then((ownMessage) => {
    setTimeout(() => {
      ownMessage.delete();
    }, timeout);
  });
}

// Does user have permission - Checks if the user has a specified permission.
export async function doesUserHavePermission(
  message: discord.GuildMemberMessage,
  permission: discord.Permissions
) {
  return new Promise<boolean>((resolve) => {
    message
      .getGuild()
      .then(async (server) => {
        server
          .getMember(message.author.id)
          .then((member) => {
            if (member != null && member.can(permission)) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(() => {
            resolve(false);
          });
      })
      .catch(() => {
        resolve(false);
      });
  });
}

// User timeout functions - Sets limits on how fast a user can use commands.
async function isUserTimedOut(message: discord.GuildMemberMessage) {
  return new Promise<boolean>(async (resolve) => {
    // Check if the user is not a manager.
    let manager = await doesUserHavePermission(
      message,
      discord.Permissions.MANAGE_GUILD
    );
    if (!manager) {
      // Get all users from the timed out list.
      let database = new pylon.KVNamespace('timeout');
      database
        .get<any[]>('timedOut')
        .then((users) => {
          let time = new Date().getTime();
          if (users != null) {
            // The timed out list has users in it, check if any of them are the current one.
            let userSearch = (element: any) => element.id == message.author.id;
            let user = users.find(userSearch);
            if (user != null) {
              let cooldownTime = user.date + CFG.COMMAND_COOLDOWN;
              if (cooldownTime < time) {
                // Rare edge case: User is on the list but is not spamming, do not edit the list.
                timeoutUser(users, message.author.id);
                resolve(false);
              } else {
                // User is on the list and is spamming, warn them with an emoji.
                message.addReaction('⏰');
                resolve(true);
              }
            } else {
              // User is not on the list, add them to the list.
              users.push({ id: message.author.id, date: time });
              timeoutUser(users, message.author.id);
              resolve(false);
            }
          } else {
            // Rare edge case: The list is uninitialised, initialise it with the user.
            timeoutUser(
              [{ id: message.author.id, date: time }],
              message.author.id
            );
            resolve(false);
          }
        })
        .catch((err) => {
          // There was an error with the database, allow user to use the command without doing anything.
          resolve(false);
        });
    } else {
      // User is a manager, do not apply timeouts.
      resolve(false);
    }
  });
}
async function timeoutUser(array: any[], id: string) {
  // Timeout user.
  let database = new pylon.KVNamespace('timeout');
  database.put('timedOut', array).then(() =>
    setTimeout(() => {
      // Untimeout user.
      database.get<any[]>('timedOut').then((users) => {
        if (users != null) {
          let userSearch = (element: any) => (element.id = id);
          let index = users.findIndex(userSearch);
          if (index >= 0) {
            users.splice(index, 1);
            database.put('timedOut', users);
          }
        }
      });
    }, CFG.COMMAND_COOLDOWN)
  );
}

// Get default prefix - For initialising new commands, uses the first defined prefix.
function getDefaultPrefix() {
  if (CFG.COMMAND_PREFIXES.length >= 1) {
    return CFG.COMMAND_PREFIXES[0];
  }
  return '>'; // A failsafe default prefix is used if no prefix exists.
}

// Get all prefixes - For initialising additional prefixes for new commands, uses all other defined prefixes.
function getAllPrefixes() {
  if (CFG.COMMAND_PREFIXES.length >= 2) {
    return CFG.COMMAND_PREFIXES.slice(1, CFG.COMMAND_PREFIXES.length - 1);
  }
  return undefined;
}
