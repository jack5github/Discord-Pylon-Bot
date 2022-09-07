/* Dad Jokes
 * Requests a dad joke from an API specifically about dad jokes.
 * I am surprised that such a thing even exists.
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  getString,
} from '../global';

createCommand({
  name: 'dadjoke',
  category: 'fun',
  aliases: ['dad', 'dadhumor', 'funny', 'joke', 'humor'],
  description: getString('cmd_dadjoke'),
  longDescription: getString('cmd_dadjoke_long'),
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    dadJokeCommand(message);
  },
});

async function dadJokeCommand(message: discord.GuildMemberMessage) {
  let response = await fetch('https://icanhazdadjoke.com', {
    headers: {
      Accept: 'application/json',
    },
  });
  await response
    .json()
    .then(async (dadJoke) => {
      // Turn the dad joke into an embed.
      let embed = createEmbed();
      embed.setTitle(dadJoke.joke);
      await message.reply(embed);
    })
    .catch(() => {
      // There was an error getting a dad joke, the API might be down.
      createErrorEmbed(message, getString('dadjoke_api_error'));
    });
}
