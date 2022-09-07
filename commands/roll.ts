/* Roll Dice
 * This command rolls a 6-sided die and returns the result.
 * Optionally, a user may specify a number of sides for the die.
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  getString,
} from '../global';

createCommand({
  name: 'roll',
  category: 'fun',
  aliases: ['d', 'dice', 'die', 'r'],
  description: getString('cmd_roll'),
  longDescription: getString('cmd_roll_long'),
  args: [{ name: '[sides]', description: getString('cmd_roll_arg_sides') }],
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    rollCommand(message, input);
  },
});

async function rollCommand(
  message: discord.GuildMemberMessage,
  input: string | string[] | null
) {
  let sides = 6;
  if (input != null) {
    // The user provided a number of sides, use that number instead of the default.
    let inputNumber = parseInt(input[0]);
    if (!isNaN(inputNumber)) {
      sides = inputNumber;
    } else {
      sides = 0;
    }
  }
  if (sides >= 1) {
    // The die has a positive number of sides, roll it.
    let embed = createEmbed();
    let roll = Math.floor(Math.random() * sides) + 1;
    embed.setTitle('🎲 You rolled a ' + roll + '.');
    message.reply(embed);
  } else {
    // The die has a zero or negative number of sides, return an error.
    createErrorEmbed(message, getString('roll_incorrect_sides'));
  }
}
