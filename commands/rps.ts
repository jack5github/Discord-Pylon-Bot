/* Rock, Paper, Scissors
 * This command lets you play rock, paper, scissors against the bot.
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  getString,
} from '../global';

createCommand({
  name: 'rps',
  category: 'fun',
  aliases: ['rockpaperscissors', 'taunt'],
  description: getString('cmd_rps'),
  longDescription: getString('cmd_rps_long'),
  args: [
    {
      name: '<hand>',
      description: getString('cmd_rps_arg_hand'),
    },
  ],
  restrictChannel: true,
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    rockPaperScissorsCommand(message, input);
  },
});

async function rockPaperScissorsCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  let invalidInput = false;
  let embed = createEmbed();
  if (input == null) {
    createErrorEmbed(message, getString('rps_start'));
    invalidInput = true;
  } else {
    let hand = input[0].toLowerCase();
    if (hand == 'rock' || hand == 'paper' || hand == 'scissors') {
      let randomInt = Math.floor(Math.random() * 3);
      if (randomInt == 0) {
        if (hand == 'rock') {
          embed.setTitle(getString('rps_rock_vs_rock'));
        } else if (hand == 'paper') {
          embed.setTitle(getString('rps_rock_vs_paper'));
        } else {
          embed.setTitle(getString('rps_rock_vs_scissors'));
        }
      } else if (randomInt == 1) {
        if (hand == 'rock') {
          embed.setTitle(getString('rps_paper_vs_rock'));
        } else if (hand == 'paper') {
          embed.setTitle(getString('rps_paper_vs_paper'));
        } else {
          embed.setTitle(getString('rps_paper_vs_scissors'));
        }
      } else {
        if (hand == 'rock') {
          embed.setTitle(getString('rps_scissors_vs_rock'));
        } else if (hand == 'paper') {
          embed.setTitle(getString('rps_scissors_vs_paper'));
        } else {
          embed.setTitle(getString('rps_scissors_vs_scissors'));
        }
      }
    } else if (hand == 'shoot') {
      embed.setTitle(getString('rps_shoot'));
    } else {
      // No valid hand was supplied, show an error.
      createErrorEmbed(message, getString('rps_incorrect_hand'));
      invalidInput = true;
    }
    if (!invalidInput) {
      await message.reply(embed);
    }
  }
}
