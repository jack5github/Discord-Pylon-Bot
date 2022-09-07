/* Steam Game Picker
 * This command selects a random Steam game from a particular user's library.
 * It is useful for when someone wants to play a game but doesn't know which one.
 * It requires a steamid64 in order to show games from other users' libraries.
 * This command requires a Steam API key.
 */

import { createCommand, createErrorEmbed, getString } from '../global';
import { STEAMGAME_DEFAULT_STEAMID64 } from '../config';
import { STEAM_API_KEY } from '../secrets';

createCommand({
  name: 'steamgame',
  category: 'fun',
  aliases: ['library', 'randomgame', 'steamlibrary'],
  description: getString('cmd_steamgame'),
  longDescription: getString('cmd_steamgame_long'),
  args: [
    {
      name: '[steamid64]',
      description: getString('cmd_steamgame_arg_steamid64'),
    },
  ],
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    steamGameCommand(message, input);
  },
});

async function steamGameCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  if (STEAM_API_KEY != null && STEAM_API_KEY != '') {
    let steamid = STEAMGAME_DEFAULT_STEAMID64;
    if (input != null) {
      steamid = input[0];
    }
    if (!steamid.match(/^[0-9]+$/)) {
      createErrorEmbed(message, getString('steamgame_incorrect_id'));
    } else {
      let getSend =
        'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' +
        STEAM_API_KEY +
        '&steamid=' +
        steamid;
      message.reply(getString('steamgame_running')).then(async (wipMessage) => {
        let steamApi = await fetch(getSend);
        if (steamApi.status != 200) {
          // The request failed to complete.
          wipMessage.delete();
          if (steamApi.status == 500) {
            await createErrorEmbed(message, getString('steamgame_unknown_id'));
          } else {
            await createErrorEmbed(message, getString('steamgame_api_error'));
          }
        } else {
          // The request completed successfully.
          let library = await steamApi.json();
          let randomInt = Math.floor(
            Math.random() * library.response.game_count
          );
          await wipMessage.edit(
            'https://store.steampowered.com/app/' +
              library.response.games[randomInt].appid
          );
        }
      });
    }
  } else {
    await createErrorEmbed(message, getString('steamgame_api_unset'));
  }
}
