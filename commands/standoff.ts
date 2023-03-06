/* Western Standoff
 * A fight of reaction times between two users.
 * Both users confirm the standoff then a random timer counts down to when they should draw their weapons.
 * The first user to react to the message after the timer wins.
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  getString,
} from '../global';
import {
  STANDOFF_WAIT_MINIMUM,
  STANDOFF_WAIT_MAXIMUM,
  STANDOFF_TIMEOUT,
} from '../config';

createCommand({
  name: 'standoff',
  category: 'fun',
  aliases: ['duel', 'fight', 'rdo', 'rdr', 'stand', 'war'],
  description: getString('cmd_standoff'),
  longDescription: getString('cmd_standoff_long'),
  args: [
    {
      name: '<user>',
      description: getString('cmd_standoff_arg_user'),
    },
    {
      name: '>fire',
      description: getString('cmd_standoff_arg_fire'),
    },
  ],
  restrictChannel: true,
  featured: true,
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    standoffCommand(message, input);
  },
});

createCommand({
  name: 'fire',
  restrictChannel: true,
  showInHelp: false,
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    fireCommand(message, input);
  },
});

async function standoffCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  if (input != null) {
    let user: discord.User | null = null;
    if (message.mentions[0] != null) {
      // Get the user mentioned.
      user = await discord.getUser(message.mentions[0].id);
    } else {
      // Get the user ID supplied.
      await discord.getUser(input[0]).then((parseUser) => {
        if (parseUser != null) {
          user = parseUser;
        }
      });
    }
    if (user != null) {
      let target = user.id;
      if (target != message.author.id) {
        // Other user specified, check if there is an pending standoff from that user targeting the current user.
        let database = new pylon.KVNamespace('standoff');
        database
          .get<string[]>('activeGames')
          .then((games: any[] | undefined) => {
            if (games != null) {
              let gameSearch = (element: any) =>
                element.id == target && element.id2 == message.author.id;
              let index = games.findIndex(gameSearch);
              if (index != -1) {
                // There is a matching pending standoff, check if it has already been readied.
                if (games[index].ready == 0) {
                  // The standoff is not ready, start it.
                  games[index].ready = 1;
                  database
                    .put('activeGames', games)
                    .then(() => {
                      let embed = createEmbed();
                      embed.setTitle(getString('standoff_ready_title'));
                      embed.setDescription(getString('standoff_ready_desc'));
                      message.reply(embed).then((oldMessage) => {
                        // After a certain amount of time, allow the users to fire at each-other.
                        setTimeout(() => {
                          database
                            .get<string[]>('activeGames')
                            .then((updatedGames: any[] | undefined) => {
                              if (updatedGames != null) {
                                gameSearch = (element: any) =>
                                  element.id == target &&
                                  element.id2 == message.author.id &&
                                  element.ready == 1;
                                let index = updatedGames.findIndex(gameSearch);
                                games[index].ready = 2;
                                database
                                  .put('activeGames', games)
                                  .then(() => {
                                    embed = createEmbed();
                                    embed.setTitle(
                                      getString('standoff_fire_title')
                                    );
                                    embed.setDescription(
                                      getString('standoff_fire_desc')
                                    );
                                    oldMessage.delete();
                                    message.reply(embed);
                                  })
                                  .catch(() => {
                                    createErrorEmbed(
                                      message,
                                      getString('standoff_db_error')
                                    );
                                  });
                              }
                            })
                            .catch(() => {
                              createErrorEmbed(
                                message,
                                getString('standoff_db_error')
                              );
                            });
                        }, Math.floor(Math.random() * STANDOFF_WAIT_MINIMUM) + (STANDOFF_WAIT_MAXIMUM - STANDOFF_WAIT_MINIMUM));
                      });
                    })
                    .catch(() => {
                      createErrorEmbed(message, getString('standoff_db_error'));
                    });
                } else {
                  // The standoff is currently readied, do not proceed any further.
                  createErrorEmbed(message, getString('standoff_ready_exists'));
                }
              } else {
                // There is no matching pending standoff, check if the current user is trying to create a duplicate.
                gameSearch = (element: any) =>
                  element.id == message.author.id && element.id2 == target;
                index = games.findIndex(gameSearch);
                if (index != -1) {
                  // There is a duplicate in existance, warn the user.
                  if (user != null) {
                    createErrorEmbed(
                      message,
                      getString('standoff_duplicate').replaceAll(
                        '%1',
                        user.username
                      )
                    );
                  }
                } else {
                  // There is still no matching pending standoff, create a pending standoff.
                  let newGame = {
                    id: message.author.id,
                    id2: target,
                    ready: 0,
                    time: new Date().getTime(),
                  };
                  games.push(newGame);
                  database
                    .put('activeGames', games)
                    .then(() => {
                      let embed = createEmbed();
                      embed.setTitle(getString('standoff_propose_title'));
                      if (user != null) {
                        embed.setDescription(
                          getString('standoff_propose_desc')
                            .replaceAll('%1', user.username)
                            .replaceAll('%2', message.author.toMention())
                        );
                      }
                      message.reply(embed);
                    })
                    .catch(() => {
                      createErrorEmbed(message, getString('standoff_db_error'));
                    });
                }
              }
            } else {
              // There are no standoffs in existance, create a pending standoff.
              let newGame = {
                id: message.author.id,
                id2: target,
                ready: 0,
                time: new Date().getTime(),
              };
              database
                .put('activeGames', [newGame])
                .then(() => {
                  let embed = createEmbed();
                  embed.setTitle(getString('standoff_propose_title'));
                  if (user != null) {
                    embed.setDescription(
                      getString('standoff_propose_desc')
                        .replaceAll('%1', user.username)
                        .replaceAll('%2', message.author.toMention())
                    );
                  }
                  message.reply(embed);
                })
                .catch(() => {
                  createErrorEmbed(message, getString('standoff_db_error'));
                });
            }
          })
          .catch(() => {
            createErrorEmbed(message, getString('standoff_db_error'));
          });
      } else {
        // Self specified, throw an error.
        createErrorEmbed(message, getString('standoff_self'));
      }
    } else {
      // Other user not specified, throw an error.
      createErrorEmbed(message, getString('unknown_user'));
    }
  } else {
    // No text supplied, respond with a generic explanation of the command.
    let embed = createEmbed();
    embed.setTitle(getString('standoff_info_title'));
    embed.setDescription(getString('standoff_info_desc'));
    message.reply(embed);
  }
}

async function fireCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  // Check if the user is involved in an active standoff.
  let database = new pylon.KVNamespace('standoff');
  database
    .get<string[]>('activeGames')
    .then((games: any[] | undefined) => {
      if (games != null) {
        let gameSearch = (element: any) =>
          (element.id == message.author.id ||
            element.id2 == message.author.id) &&
          element.ready == 2;
        let index = games.findIndex(gameSearch);
        if (index != -1) {
          // If the user is, they win the standoff.
          games.splice(index, 1);
          database
            .put('activeGames', games)
            .then(() => {
              let embed = createEmbed();
              embed.setTitle(
                getString('standoff_winner').replaceAll(
                  '%1',
                  message.author.username
                )
              );
              message.reply(embed);
            })
            .catch(() => {
              createErrorEmbed(message, getString('standoff_db_error'));
            });
        } else {
          // If not, they have likely lost a standoff.
          createErrorEmbed(
            message,
            getString('standoff_loser').replaceAll(
              '%1',
              message.author.username
            )
          );
        }
      }
    })
    .catch(() => {
      createErrorEmbed(message, getString('standoff_db_error'));
    });
}

// Purges old challenges to save database space, a scheduled task.
export async function deleteExpiredStandoffs() {
  let database = new pylon.KVNamespace('standoff');
  await database.get<any[]>('activeGames').then(async (games) => {
    if (games != null && games.length > 0) {
      let time = new Date().getTime();
      for (let i = games.length - 1; i >= 0; i--) {
        if (games[i].time + STANDOFF_TIMEOUT < time) {
          games.splice(i, 1);
        }
      }
      database.put('activeGames', games);
    }
  });
}
