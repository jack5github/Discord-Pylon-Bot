/* Hug a User
 * A nice little command that lets users hug others by replying to messages.
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  getString,
} from '../global';

createCommand({
  name: 'hug',
  category: 'chat',
  aliases: ['cuddle'],
  description: getString('cmd_hug'),
  longDescription: getString('cmd_hug_long'),
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    hugCommand(message, input);
  },
});

async function hugCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  message.getChannel().then(async (channel) => {
    if (
      message.messageReference != null &&
      message.messageReference.messageId != null
    ) {
      channel
        .getMessage(message.messageReference.messageId)
        .then(async (msg) => {
          if (msg != null) {
            if (message.author.id != msg.author.id) {
              let embed = createEmbed();
              embed.setTitle(
                getString('hug_other_user')
                  .replaceAll('%1', message.author.username)
                  .replaceAll('%2', msg.author.username)
              );
              await message.reply(embed);
            } else {
              await createErrorEmbed(
                message,
                getString('hug_no_or_self_reply')
              );
            }
          } else {
            await createErrorEmbed(message, getString('hug_reply_error'));
          }
        });
    } else {
      await createErrorEmbed(message, getString('hug_no_or_self_reply'));
    }
  });
}
