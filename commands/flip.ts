/* Flip a Coin
 * A simple command that flips a coin and returns the result in an embed.
 */

import { createCommand, createEmbed, getString } from '../global';

createCommand({
  name: 'flip',
  category: 'fun',
  aliases: ['coin', 'coinflip'],
  description: getString('cmd_flip'),
  longDescription: getString('cmd_flip_long'),
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    flipCommand(message);
  },
});

async function flipCommand(message: discord.GuildMemberMessage) {
  let embed = createEmbed();
  let randomInt = Math.floor(Math.random() * 2);
  if (randomInt == 0) {
    embed.setTitle(getString('flip_heads'));
  } else {
    embed.setTitle(getString('flip_tails'));
  }
  await message.reply(embed);
}
