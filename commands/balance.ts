/* Currency Balance
 * This command will show the user how much currency they have accumulated.
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  doesUserHavePermission,
  getString,
} from '../global';
import {
  getUserCurrency,
  addUserCurrency,
  subtractUserCurrency,
  setUserCurrency,
} from '../economy';

createCommand({
  name: 'balance',
  category: 'economy',
  aliases: ['bal', 'bank', 'cash', 'coins', 'dollars', 'money', 'wallet'],
  description: getString('cmd_balance').replaceAll(
    '%1',
    getString('currency_name')
  ),
  longDescription: getString('cmd_balance_long').replaceAll(
    '%1',
    getString('currency_name')
  ),
  args: [
    {
      name: 'lb [page]',
      description: getString('cmd_balance_arg_lb').replaceAll(
        '%1',
        getString('currency_name')
      ),
    },
    {
      name: 'add [user] <#>',
      description: getString('cmd_balance_arg_add').replaceAll(
        '%1',
        getString('currency_name')
      ),
    },
    {
      name: 'subtract [user] <#>',
      description: getString('cmd_balance_arg_subtract').replaceAll(
        '%1',
        getString('currency_name')
      ),
    },
    {
      name: 'set [user] <#>',
      description: getString('cmd_balance_arg_set').replaceAll(
        '%1',
        getString('currency_name')
      ),
    },
    {
      name: 'clear [user] <#>',
      description: getString('cmd_balance_arg_clear').replaceAll(
        '%1',
        getString('currency_name')
      ),
    },
  ],
  restrictChannel: true,
  featured: true,
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    balanceCommand(message, input);
  },
});

async function balanceCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  if (input == null) {
    // Get the current user's currency balance.
    let balance = await getUserCurrency(message.author.id);
    if (balance != -1) {
      let embed = createEmbed();
      let msg = getString('balance_message')
        .replaceAll('%1', balance)
        .replaceAll('%2', getString('currency_icon'));
      if (balance != 1) {
        msg = msg.replaceAll('%3', getString('currency_name'));
      } else {
        msg = msg.replaceAll('%3', getString('currency_name_single'));
      }
      embed.setTitle(msg);
      await message.reply(embed);
    } else {
      await createErrorEmbed(message, getString('balance_db_error'));
    }
  } else if (
    input[0] == 'add' ||
    input[0] == 'subtract' ||
    input[0] == 'set' ||
    input[0] == 'clear'
  ) {
    let manager = await doesUserHavePermission(
      message,
      discord.Permissions.MANAGE_GUILD
    );
    if (manager) {
      let user = null;
      if (input.length == 1 && input[0] == 'clear') {
        // Get the balance for the current user, clearing only.
        user = message.author;
      } else if (input.length == 2 && input[0] != 'clear') {
        // Get the balance for the current user, adding, subtracting and setting only.
        user = message.author;
      } else if (message.mentions[0] != null) {
        // Get the balance for the mentioned user.
        user = message.mentions[0];
      } else {
        // Get the balance for the specified user ID.
        await discord.getUser(input[1]).then((parseUser) => {
          if (parseUser != null) {
            user = parseUser;
          }
        });
      }
      if (user != null) {
        if (input[0] == 'add' || input[0] == 'subtract' || input[0] == 'set') {
          let amount = parseInt(input[1]);
          if (input.length >= 3) {
            amount = parseInt(input[2]);
          }
          if (!isNaN(amount) && amount >= 0) {
            // Add to the specified user's balance.
            if (input[0] == 'add') {
              let addStatus = await addUserCurrency(user.id, amount);
              if (addStatus == 1) {
                let embed = createEmbed();
                let newCurrency = await getUserCurrency(user.id);
                let msg = getString('balance_update')
                  .replaceAll('%1', user.username)
                  .replaceAll('%2', newCurrency)
                  .replaceAll('%3', getString('currency_icon'));
                if (newCurrency != 1) {
                  msg = msg.replaceAll('%4', getString('currency_name'));
                } else {
                  msg = msg.replaceAll('%4', getString('currency_name_single'));
                }
                embed.setTitle(msg);
                message.reply(embed);
              } else {
                createErrorEmbed(
                  message,
                  getString('balance_update_error').replaceAll(
                    '%1',
                    user.username
                  )
                );
              }
            } else if (input[0] == 'subtract') {
              // Subtract from the specified user's balance.
              let subtractStatus = await subtractUserCurrency(user.id, amount);
              if (subtractStatus == 1) {
                let embed = createEmbed();
                let newCurrency = await getUserCurrency(user.id);
                let msg = getString('balance_update')
                  .replaceAll('%1', user.username)
                  .replaceAll('%2', newCurrency)
                  .replaceAll('%3', getString('currency_icon'));
                if (newCurrency != 1) {
                  msg = msg.replaceAll('%4', getString('currency_name'));
                } else {
                  msg = msg.replaceAll('%4', getString('currency_name_single'));
                }
                embed.setTitle(msg);
                message.reply(embed);
              } else if (subtractStatus == 0) {
                createErrorEmbed(
                  message,
                  getString('balance_subtract_poor').replaceAll(
                    '%1',
                    user.username
                  )
                );
              } else {
                createErrorEmbed(
                  message,
                  getString('balance_update_error').replaceAll(
                    '%1',
                    user.username
                  )
                );
              }
            } else if (input[0] == 'set') {
              // Set the specified user's balance.
              let setStatus = await setUserCurrency(user.id, amount);
              if (setStatus == 1) {
                let embed = createEmbed();
                let newCurrency = await getUserCurrency(user.id);
                let msg = getString('balance_update')
                  .replaceAll('%1', user.username)
                  .replaceAll('%2', newCurrency)
                  .replaceAll('%3', getString('currency_icon'));
                if (newCurrency != 1) {
                  msg = msg.replaceAll('%4', getString('currency_name'));
                } else {
                  msg = msg.replaceAll('%4', getString('currency_name_single'));
                }
                embed.setTitle(msg);
                message.reply(embed);
              } else {
                createErrorEmbed(
                  message,
                  getString('balance_update_error').replaceAll(
                    '%1',
                    user.username
                  )
                );
              }
            } else {
              // Improper usage of clear.
              createErrorEmbed(message, getString('balance_incorrect_arg'));
            }
          } else {
            // Amount is not a whole positive number.
            createErrorEmbed(message, getString('balance_incorrect_amount'));
          }
        } else if (input[0] == 'clear') {
          // Clear the specified user's balance.
          let clearStatus = await setUserCurrency(user.id, 0);
          if (clearStatus == 1) {
            let embed = createEmbed();
            embed.setTitle(
              getString('balance_update')
                .replaceAll('%1', user.username)
                .replaceAll('%2', 0)
                .replaceAll('%3', getString('currency_icon'))
                .replaceAll('%4', getString('currency_name'))
            );
            message.reply(embed);
          } else {
            createErrorEmbed(
              message,
              getString('balance_update_error').replaceAll('%1', user.username)
            );
          }
        }
      } else {
        // The specified user could not be found.
        createErrorEmbed(message, getString('unknown_user'));
      }
    } else {
      // The user does not have permission.
      createErrorEmbed(message, getString('no_permission'));
    }
  } else if (input[0] == 'lb') {
    let database = new pylon.KVNamespace('economy');
    database
      .get<any[]>('balance')
      .then(async (users) => {
        if (users != null && users.length >= 1) {
          // Determine the number of pages and what page to display
          let currentPage = 1;
          if (input.length >= 2) {
            currentPage = parseInt(input[1]);
          }
          let usersPerPage = 10;
          let pages = Math.ceil(users.length / usersPerPage);
          if (currentPage >= 1 && currentPage <= pages) {
            // Sort the user scores.
            function compare(a: any, b: any) {
              if (a.amount > b.amount) {
                return -1;
              } else if (a.amount < b.amount) {
                return 1;
              }
              return 0;
            }
            users.sort(compare);
            // Create the embed.
            let embed = createEmbed();
            embed.setTitle(
              getString('balance_lb_title')
                .replaceAll('%1', getString('currency_icon'))
                .replaceAll('%2', getString('currency_name'))
            );
            embed.setFooter({
              text: getString('page_numbers')
                .replaceAll('%1', currentPage)
                .replaceAll('%2', pages),
            });
            let description = '';
            let index = 0 + (currentPage - 1) * usersPerPage;
            let maximum = users.length - index;
            if (maximum > usersPerPage) {
              maximum = usersPerPage;
            }
            function ordinal(n: number) {
              let s = ['th', 'st', 'nd', 'rd'];
              let v = n % 100;
              return s[(v - 20) % 10] || s[v] || s[0];
            }
            for (let i = 0; i < maximum; i++) {
              description =
                description +
                getString('balance_lb_row')
                  .replaceAll('%1', index + 1 + i)
                  .replaceAll('%2', ordinal(index + 1 + i))
                  .replaceAll('%3', '<@' + users[index + i].id + '>')
                  .replaceAll('%4', users[index + i].amount)
                  .replaceAll('%5', getString('currency_name'));
              if (i < usersPerPage - 1) {
                description = description + '\n';
              }
            }
            embed.setDescription(description);
            await message.reply(embed);
          } else {
            await createErrorEmbed(
              message,
              getString('incorrect_page').replaceAll('%1', pages)
            );
          }
        } else {
          await createErrorEmbed(message, getString('balance_lb_no_users'));
        }
      })
      .catch(async () => {
        await createErrorEmbed(message, getString('balance_lb_error'));
      });
  } else {
    // Unacceptable argument.
    createErrorEmbed(message, getString('balance_incorrect_arg'));
  }
}
