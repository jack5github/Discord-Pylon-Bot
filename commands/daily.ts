/* Daily Currency
 * This command will reward the user with a randomised amount of free currency, but only once per day.
 * Makes use of a scheduled task to track when a new day starts.
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  getString,
} from '../global';
import { ECONOMY_DAILY_MINIMUM, ECONOMY_DAILY_MAXIMUM } from '../config';
import { addUserCurrency } from '../economy';

createCommand({
  name: 'daily',
  category: 'economy',
  aliases: ['bonus', 'gift', 'present', 'work'],
  description: getString('cmd_daily').replaceAll(
    '%1',
    getString('currency_name')
  ),
  longDescription: getString('cmd_daily_long').replaceAll(
    '%1',
    getString('currency_name')
  ),
  restrictChannel: true,
  featured: true,
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    dailyCommand(message);
  },
});

async function dailyCommand(message: discord.GuildMemberMessage) {
  // Check whether the user has claimed their daily gift or not.
  let database = new pylon.KVNamespace('economy');
  await database
    .get<string[]>('dailyClaims')
    .then(async (users) => {
      let giveCurrency = true;
      if (users != null) {
        let userSearch = (element: string) => element == message.author.id;
        let user = users.find(userSearch);
        if (user != null) {
          // User has claimed a daily gift already, warn them of this.
          createErrorEmbed(message, getString('daily_already_claimed'));
          giveCurrency = false;
        }
      }
      if (giveCurrency) {
        // User has not claimed a daily gift or the database is not initialised, provide it to them.
        let giftAmount = Math.floor(
          Math.random() * (ECONOMY_DAILY_MAXIMUM - ECONOMY_DAILY_MINIMUM) +
            ECONOMY_DAILY_MINIMUM
        );
        let giftStatus = await addUserCurrency(message.author.id, giftAmount);
        if (giftStatus == 1) {
          // Add the user to the list of users that have claimed their reward.
          if (users != null) {
            users.push(message.author.id);
          } else {
            users = [message.author.id];
          }
          database.put('dailyClaims', users); // It is assumed this will work since the gift claiming worked.
          // Show an embed to the user revealing their reward.
          let embed = createEmbed();
          let msg = getString('daily_claim')
            .replaceAll('%1', giftAmount)
            .replaceAll('%2', getString('currency_icon'));
          if (giftAmount != 1) {
            msg = msg.replaceAll('%3', getString('currency_name'));
          } else {
            msg = msg.replaceAll('%3', getString('currency_name_single'));
          }
          embed.setTitle(msg);
          embed.setDescription(getString('daily_claim_desc'));
          await message.reply(embed);
        } else {
          // There was an error with the database, report this error.
          await createErrorEmbed(message, getString('daily_db_claim_error'));
        }
      }
    })
    .catch((err) => {
      console.log(err);
      // There was an error with the database, report this error.
      createErrorEmbed(message, getString('daily_db_currency_error'));
    });
}
