/* Avatar Command
 * This command returns the high-quality avatar of the specified user.
 */

import { createCommand, createErrorEmbed, getString } from '../global';

createCommand({
  name: 'avatar',
  category: 'system',
  aliases: ['icon', 'image', 'pfp', 'pic', 'picture', 'profile'],
  description: getString('cmd_avatar'),
  longDescription: getString('cmd_avatar_long'),
  args: [
    {
      name: '[user]',
      description: getString('cmd_avatar_arg_user'),
    },
  ],
  restrictChannel: true,
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    avatarCommand(message, input);
  },
});

async function avatarCommand(
  message: discord.GuildMemberMessage,
  input: any[] | null
) {
  let user = null;
  if (input == null) {
    // Get the avatar for the current user.
    user = message.author;
  } else if (message.mentions[0] != null) {
    // Get the avatar for the mentioned user.
    user = await discord.getUser(message.mentions[0].id);
  } else {
    // Get the avatar for the specified user ID.
    await discord.getUser(input[0]).then((parseUser) => {
      if (parseUser != null) {
        user = parseUser;
      }
    });
  }
  if (user != null) {
    await message.reply(user.getAvatarUrl());
  } else {
    await createErrorEmbed(message, getString('unknown_user'));
  }
}
