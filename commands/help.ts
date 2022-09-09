/* Help (Commands Hub)
 * This command reads the information for all other commands in order to display helpful information to the user.
 * Commands are split up into categories, then can be examined individually.
 * Supports descriptions, arguments and argument descriptions.
 */

import {
  createCommand,
  getCommandHelpTopics,
  getCommandCategories,
  createEmbed,
  createErrorEmbed,
  getString,
} from '../global';
import { DEV_CHANNEL } from '../config';

createCommand({
  name: 'help',
  category: 'system',
  aliases: ['category', 'command', 'h', 'i', 'info', 'topic'],
  description: getString('cmd_help'),
  longDescription: getString('cmd_help_long'),
  args: [
    {
      name: '[topic]',
      description: getString('cmd_help_arg_topic'),
    },
  ],
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    helpCommand(message, input);
  },
});

async function helpCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  // Get the current channel before anything else.
  message.getChannel().then(async (channel) => {
    let embed = createEmbed();
    if (input == null) {
      // User has entered the help command without any input, find all categories in use.
      let categories: string[] = [];
      let commands = getCommandHelpTopics();
      getCommandCategories().forEach((category: any) => {
        let i = 0;
        do {
          if (commands[i].category == category.name) {
            if (!commands[i].devOnly || channel.id == DEV_CHANNEL) {
              categories.push(category.name);
              i = commands.length;
            }
          }
          i++;
        } while (i < commands.length);
      });
      if (categories.length != 0) {
        // Matching categories were found, display them on the embed.
        message.getGuild().then(async (server) => {
          embed.setTitle(getString('help_title').replaceAll('%1', server.name));
          embed.setDescription(getString('help_desc'));
          let fields: { name: string; value: string; inline: boolean }[] = [];
          categories.forEach((category) => {
            // Find information about each command category.
            let categorySearch = (element: any) => element.name == category;
            let categoryInfo = getCommandCategories().find(categorySearch);
            let categoryTitle = '`' + category + '`';
            let categoryDescription = getString('help_default_desc');
            if (categoryInfo != null) {
              categoryTitle = categoryTitle + ': ' + categoryInfo.title;
              if (categoryInfo.description != null) {
                categoryDescription = categoryInfo.description;
              }
            }
            fields.push({
              name: categoryTitle,
              value: categoryDescription,
              inline: true,
            });
          });
          embed.setFields(fields);
          await message.reply(embed);
        });
      } else {
        // There are no categories, show an error.
        createErrorEmbed(message, getString('help_no_categories'));
      }
    } else {
      // User has specified a category or a command, search for categories first.
      let categorySearch = (element: any) =>
        element.name == input[0].toLowerCase();
      let category = getCommandCategories().find(categorySearch);
      if (category != null) {
        // A matching category was found, find all commands inside it.
        let commands: any[] = [];
        getCommandHelpTopics().forEach((command) => {
          if (category != null && command.category == category.name) {
            if (!command.devOnly || channel.id == DEV_CHANNEL) {
              commands.push(command);
            }
          }
        });
        if (commands.length != 0) {
          // Sort them alphabetically.
          function compare(a: any, b: any) {
            if (a.name < b.name) {
              return -1;
            } else if (a.name > b.name) {
              return 1;
            }
            return 0;
          }
          commands.sort(compare);
          // Display them on an embed.
          embed.setTitle(category.title);
          if (category.longDescription != null) {
            embed.setDescription(category.longDescription);
          } else {
            embed.setDescription(category.description);
          }
          let fields: { name: string; value: string; inline: boolean }[] = [];
          commands.forEach((command) => {
            if (command != null) {
              let description = getString('help_default_desc');
              if (command.description != null && command.description != '') {
                description = command.description;
              }
              fields.push({
                name: '`' + command.name + '`',
                value: description,
                inline: true,
              });
            }
          });
          embed.setFields(fields);
          await message.reply(embed);
        } else {
          // No commands are in the category.
          createErrorEmbed(message, getString('help_no_cmds_in_category'));
        }
      } else {
        // No matching category was found, now search for commands.
        let commandSearch = (element: any) =>
          element.name == input[0].toLowerCase();
        let command = getCommandHelpTopics().find(commandSearch);
        if (
          command != null &&
          (!command.devOnly || channel.id == DEV_CHANNEL)
        ) {
          // A matching command was found, display all information about it.
          embed.setTitle('`' + command.name + '`');
          let description = '';
          if (command.aliases != null) {
            description += getString('help_cmd_aliases') + ' ';
            for (let i = 0; i < command.aliases.length; i++) {
              description += '`' + command.aliases[i] + '`';
              if (i < command.aliases.length - 1) {
                description += ', ';
              }
            }
            description += '\n';
          }
          if (command.longDescription != null) {
            description += command.longDescription;
          } else if (command.description != null) {
            description += command.description;
          }
          if (command.args != null) {
            description += '\n' + getString('help_cmd_args') + '\n';
            for (let i = 0; i < command.args.length; i++) {
              description +=
                '`' +
                command.args[i].name +
                '` - ' +
                command.args[i].description;
              if (i < command.args.length - 1) {
                description += '\n';
              }
            }
          }
          embed.setDescription(description);
          await message.reply(embed);
        } else {
          // No matching command or category was found, show an error.
          createErrorEmbed(
            message,
            getString('help_incorrect').replaceAll('%1', input[0].toLowerCase())
          );
        }
      }
    }
  });
}
