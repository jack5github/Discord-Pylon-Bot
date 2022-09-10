/* Cat Command
 * This command returns a picture of a cartoon cat that is unique to each user.
 * A source of discussion about how each user's cat differs from one another.
 */

import { createCommand, createErrorEmbed, getString } from '../global';

createCommand({
  name: 'cat',
  category: 'fun',
  aliases: ['pet'],
  description: getString('cmd_cat'),
  longDescription: getString('cmd_cat_long'),
  args: [
    {
      name: '[user]',
      description: getString('cmd_cat_arg_user'),
    },
  ],
  restrictChannel: true,
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    catCommand(message, input);
  },
});

async function catCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  let user: discord.User | null = null;
  if (input == null) {
    // Get the cat for the current user.
    user = message.author;
  } else if (message.mentions[0] != null) {
    // Get the cat for the mentioned user.
    user = await discord.getUser(message.mentions[0].id);
  } else {
    // Get the cat for the specified user ID.
    await discord.getUser(input[0]).then((parseUser) => {
      if (parseUser != null) {
        user = parseUser;
      }
    });
  }
  if (user != null) {
    await message.reply({
      attachments: [
        {
          // Send a request to the cat image website and retrieve an image.
          data: await fetch(
            'https://robohash.org/' + user.id + '?set=set4'
          ).then((response) => response.arrayBuffer()),
          // Rename the image to the user's name, replacing special characters with dashes.
          name: user.username.replaceAll(/[/\\?%*:|"<>]/g, '-') + '.png',
        },
      ],
    });
  } else {
    await createErrorEmbed(message, getString('unknown_user'));
  }
}
