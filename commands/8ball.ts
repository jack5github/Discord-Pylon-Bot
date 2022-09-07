/* The Magic 8-Ball
 * A simple command that returns a randomised answer from a Magic 8-Ball in an embed.
 * For use in conversations to get answers to moral questions and have a quick laugh.
 */

import { createCommand, createEmbed, getString } from '../global';

createCommand({
  name: '8ball',
  category: 'chat',
  aliases: ['8b', 'ask', 'eightball', 'question'],
  description: getString('cmd_eightball'),
  longDescription: getString('cmd_eightball_long'),
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    eightBallCommand(message);
  },
});

async function eightBallCommand(message: discord.GuildMemberMessage) {
  let embed = createEmbed();
  embed.setTitle(
    getString('eightball_message').replaceAll(
      '%1',
      getString('eightball_response')
    )
  );
  await message.reply(embed);
}
