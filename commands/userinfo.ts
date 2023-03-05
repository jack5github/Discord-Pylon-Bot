/* User Info Command
 * This command returns the information related to a specified user and their affiliation with the current Discord server.
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  getString,
} from '../global';

createCommand({
  name: 'userinfo',
  category: 'system',
  aliases: ['id', 'user'],
  description: getString('cmd_userinfo'),
  longDescription: getString('cmd_userinfo_long'),
  args: [
    {
      name: '[user]',
      description: getString('cmd_userinfo_arg_user'),
    },
  ],
  restrictChannel: true,
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    userInfoCommand(message, input);
  },
});

async function userInfoCommand(
  message: discord.GuildMemberMessage,
  input: any[] | null
) {
  let user: discord.User | null = null;
  if (input == null) {
    // Get the identification of the current user.
    user = message.author;
  } else if (message.mentions[0] != null) {
    // Get the identification of the mentioned user.
    user = await discord.getUser(message.mentions[0].id);
  } else {
    // Get the identification of the specified user ID.
    await discord.getUser(input[0]).then((parseUser) => {
      if (parseUser != null) {
        user = parseUser;
      }
    });
  }
  discord.getGuild().then(async (server) => {
    if (user != null) {
      server.getMember(user.id).then(async (member) => {
        let embed = createEmbed();
        let fields: { name: string; value: string; inline: boolean }[] = [];
        if (member != null) {
          embed.setTitle(member.nick ?? member.user.username);
          embed.setThumbnail({
            url: member.user.getAvatarUrl(),
          });
          let joinDate = new Date(member.joinedAt);
          fields = [
            {
              name: getString('userinfo_user_name'),
              value:
                '`' +
                member.user.username +
                '#' +
                member.user.discriminator +
                '`',
              inline: true,
            },
            {
              name: getString('userinfo_user_id'),
              value: '`' + member.user.id + '`',
              inline: true,
            },
            {
              name: getString('userinfo_user_joindate'),
              value:
                joinDate.getDay() +
                '/' +
                joinDate.getMonth() +
                '/' +
                joinDate.getFullYear() +
                ', ' +
                joinDate.getHours().toString().padStart(2, '0') +
                ':' +
                joinDate.getMinutes().toString().padStart(2, '0') +
                ':' +
                joinDate.getSeconds().toString().padStart(2, '0'),
              inline: true,
            },
            {
              name: getString('userinfo_user_rolecount'),
              value: member.roles.length.toString(),
              inline: true,
            },
            {
              name: getString('userinfo_user_booster'),
              value: member.premiumSince != null ? 'Yes' : 'No',
              inline: true,
            },
            {
              name: getString('userinfo_user_bot'),
              value:
                member.user.bot != null && member.user.bot == true
                  ? 'Yes'
                  : 'No',
              inline: true,
            },
          ];
        } else if (user != null) {
          embed.setTitle(user.username);
          embed.setDescription(getString('userinfo_absent'));
          embed.setThumbnail({
            url: user.getAvatarUrl(),
          });
          fields = [
            {
              name: getString('userinfo_user_name'),
              value: '`' + user.username + '#' + user.discriminator + '`',
              inline: true,
            },
            {
              name: getString('userinfo_user_id'),
              value: '`' + user.id + '`',
              inline: true,
            },
            {
              name: getString('userinfo_user_bot'),
              value: user.bot != null && user.bot == true ? 'Yes' : 'No',
              inline: true,
            },
          ];
        }
        embed.setFields(fields);
        message.reply(embed);
      });
    } else {
      await createErrorEmbed(message, getString('unknown_user'));
    }
  });
}
