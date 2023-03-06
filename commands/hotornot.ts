/* Hot or Not
 * This command allows users to rate the custom emoji on the Discord server.
 * Each user will have an associated list that ranks the emoji in order of their preferences.
 * These lists can be combined to make a rating that can be displayed in a leaderboard.
 * An old and very complicated command that has been reworked to fix the voting process, but may take up more storage.
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  getString,
} from '../global';
import { HOTORNOT_TIMEOUT } from '../config';

createCommand({
  name: 'hotornot',
  category: 'fun',
  aliases: ['emoji', 'emote', 'hon', 'hot'],
  description: getString('cmd_hotornot'),
  longDescription: getString('cmd_hotornot_long'),
  args: [
    {
      name: 'lb [page]',
      description: getString('cmd_hotornot_arg_lb'),
    },
  ],
  restrictChannel: true,
  featured: true,
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    hotOrNotCommand(message, input);
  },
});

async function hotOrNotCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  if (input == null) {
    // No arguments, set up a hot or not embed.
    hotOrNotVote(message);
  } else if (input[0] == 'lb') {
    // Leaderboard arguments, open the hot or not leaderboard.
    hotOrNotLeaderboard(message, input);
  } else {
    // Invalid arguments, throw an error.
  }
}

async function hotOrNotVote(message: discord.GuildMemberMessage) {
  // Prepare function by scoping into Discord server.
  discord.getGuild().then((server) => {
    server.getEmojis().then((emojis) => {
      // Remove incompatible emojis from third-party services.
      for (let i = emojis.length - 1; i >= 0; i--) {
        if (emojis[i].managed) {
          emojis.splice(i, 1);
        }
      }
      // Check that there are enough emojis for this function to work properly.
      if (emojis.length >= 2) {
        // There are, check if the user has an active embed already in existance.
        let database = new pylon.KVNamespace('hotornot');
        database
          .get<string[]>('activeEmbeds')
          .then((embeds: any[] | undefined) => {
            if (embeds != null) {
              let embedSearch = (element: any) =>
                element.id == message.author.id;
              let ei = embeds.findIndex(embedSearch);
              if (ei != -1) {
                // They do, delete it so a new one can be created.
                embeds.splice(ei, 1);
                database.put('activeEmbeds', embeds);
              }
            }
            database
              .get<any[]>('emojiScores')
              .then((ranks: any[] | undefined) => {
                // Initialise array shuffling function.
                function shuffle(array: any[]) {
                  if (array.length > 1) {
                    array.sort(() => Math.random() - 0.5);
                  }
                }
                // Check if the user has an existing list.
                let ri = -1;
                let emoji1: string = '';
                let emoji2: string = '';
                if (ranks != null) {
                  let rankSearch = (element: any) =>
                    element.id == message.author.id;
                  ri = ranks.findIndex(rankSearch);
                  if (ri != -1) {
                    // They do, check if the list has at least one emoji.
                    if (ranks[ri].list.length >= 1) {
                      if (ranks[ri].list.length <= emojis.length) {
                        // It is, choose one random emoji not in the list and another in the list, prioritising those that have occurred the least.
                        let emojisIn = [];
                        let emojisOut = [];
                        for (let i = 0; i < emojis.length; i++) {
                          let match = ranks[ri].list.find(
                            (element: any) => element == emojis[i].id
                          );
                          if (match) {
                            emojisIn.push(match);
                          } else {
                            emojisOut.push(emojis[i].id);
                          }
                        }
                        shuffle(emojisIn);
                        shuffle(emojisOut);
                        emoji1 = emojisIn[0];
                        if (emojisOut[0] != null) {
                          emoji2 = emojisOut[0];
                        }
                      } else {
                        // It is not, choose two random emojis in the list, prioritising those that have occurred the least.
                        ranks[ri].list = shuffle(ranks[ri].list);
                        emoji1 = ranks[ri].list[0];
                        emoji2 = ranks[ri].list[1];
                      }
                    }
                  }
                }
                if (emoji1 == '' || emoji2 == '') {
                  // If emojis have not been chosen yet, choose two randoms.
                  shuffle(emojis);
                  if (emojis[0].id != null && emojis[1].id != null) {
                    emoji1 = emojis[0].id;
                    emoji2 = emojis[1].id;
                  }
                }
                // Create the first message pitting the two emojis together.
                server.getEmoji(emoji1).then((e1) => {
                  server.getEmoji(emoji2).then((e2) => {
                    if (e1 != null && e2 != null) {
                      message
                        .reply(
                          getString('hotornot_start_emojis')
                            .replaceAll('%1', e1.toMention())
                            .replaceAll('%2', e2.toMention())
                        )
                        .then((botMessage) => {
                          // Create the second message which will capture reactions underneath an embed.
                          let embed = createEmbed();
                          embed.setTitle(getString('hotornot_start'));
                          botMessage.reply(embed).then((botEmbed) => {
                            // Store the embed as active in the database.
                            database
                              .get<string[]>('activeEmbeds')
                              .then((embeds: any[] | undefined) => {
                                let item = {
                                  id: message.author.id,
                                  embed: botEmbed.id,
                                  time: new Date().getTime(),
                                };
                                if (embeds != null) {
                                  embeds.push(item);
                                } else {
                                  embeds = [item];
                                }
                                database
                                  .put('activeEmbeds', embeds)
                                  .then(() => {
                                    // Add reactions to the embed corresponding with the battling emojis.
                                    botEmbed.addReaction(e1).then(() => {
                                      botEmbed.addReaction(e2);
                                    });
                                  })
                                  .catch(() => {
                                    // There was a database error, report to the user.
                                    createErrorEmbed(
                                      message,
                                      getString('hotornot_db_error')
                                    );
                                  });
                              });
                          });
                        });
                    }
                  });
                });
              })
              .catch(() => {
                // There was a database error, report to the user.
                createErrorEmbed(message, getString('hotornot_db_error'));
              });
          })
          .catch(() => {
            // There was a database error, report to the user.
            createErrorEmbed(message, getString('hotornot_db_error'));
          });
      } else {
        // There are not enough emojis, report to the user.
        createErrorEmbed(message, getString('hotornot_lacking_emojis'));
      }
    });
  });
}

discord.on('MESSAGE_REACTION_ADD', async (event) => {
  // Check if the message is an active embed.
  let database = new pylon.KVNamespace('hotornot');
  database.get<string[]>('activeEmbeds').then((embeds: any[] | undefined) => {
    if (embeds != null) {
      let ei = embeds.findIndex(
        (element: any) => element.embed == event.messageId
      );
      if (ei != -1) {
        // It is, check if the reacting user is the person that initiated the embed.
        if (embeds[ei].id == event.userId) {
          // It is, prepare function by scoping into Discord server.
          discord.getTextChannel(event.channelId).then((channel) => {
            if (channel != null) {
              channel.getMessage(event.messageId).then((botEmbed) => {
                if (botEmbed != null) {
                  // Check if the reacted emoji is one of the included ones.
                  let botReactions: discord.Message.IMessageReaction[] = [];
                  botEmbed.reactions.forEach((reaction) => {
                    if (reaction.me) {
                      botReactions.push(reaction);
                    }
                  });
                  if (botReactions.length == 2) {
                    let emojiWinner: discord.Emoji | null = null;
                    let emojiLoser: discord.Emoji | null = null;
                    for (let i = 0; i < botReactions.length; i++) {
                      if (event.emoji.id == botReactions[i].emoji.id) {
                        emojiWinner = botReactions[i].emoji;
                      } else {
                        emojiLoser = botReactions[i].emoji;
                      }
                    }
                    if (emojiWinner != null && emojiLoser != null) {
                      // It is, first set the embed as inactive by deleting it from the database.
                      database
                        .get<string[]>('activeEmbeds')
                        .then((embeds: any[] | undefined) => {
                          if (embeds != null) {
                            let ei = embeds.findIndex(
                              (element: any) => element.embed == event.messageId
                            );
                            if (ei != -1) {
                              embeds.splice(ei, 1);
                              database.put('activeEmbeds', embeds);
                            }
                            // Next save the vote in the database, check if the user has existing votes.
                            database
                              .get<string[]>('emojiScores')
                              .then((ranks: any[] | undefined) => {
                                if (ranks != null) {
                                  let ri = ranks.findIndex(
                                    (element: any) => element.id == event.userId
                                  );
                                  if (ri != -1) {
                                    // There are existing votes, get the indexes of the emojis on the list.
                                    let iWinner = -1;
                                    let iLoser = -1;
                                    if (
                                      emojiWinner != null &&
                                      emojiLoser != null
                                    ) {
                                      for (
                                        let i = 0;
                                        i < ranks[ri].list.length;
                                        i++
                                      ) {
                                        if (
                                          emojiWinner.id == ranks[ri].list[i]
                                        ) {
                                          iWinner = i;
                                        } else if (
                                          emojiLoser.id == ranks[ri].list[i]
                                        ) {
                                          iLoser = i;
                                        }
                                      }
                                      if (iWinner != -1 && iLoser != -1) {
                                        // Both emojis are on the list, check if the reacted one is lower than the other.
                                        if (iWinner > iLoser) {
                                          // It is, move the reacted one to above the other.
                                          ranks[ri].list.splice(iWinner, 1);
                                          ranks[ri].list.splice(
                                            iLoser,
                                            0,
                                            emojiWinner.id
                                          );
                                        }
                                      } else if (
                                        iWinner != -1 &&
                                        iLoser == -1
                                      ) {
                                        // Only the reacted is on the list, put the other just below it.
                                        ranks[ri].list.splice(
                                          iWinner + 1,
                                          0,
                                          emojiLoser.id
                                        );
                                      } else if (
                                        iWinner == -1 &&
                                        iLoser != -1
                                      ) {
                                        // Only the other is on the list, put the reacted one just above it.
                                        ranks[ri].list.splice(
                                          iLoser,
                                          0,
                                          emojiWinner.id
                                        );
                                      } else {
                                        // Neither emoji is on the list, put both in the middle.
                                        let midpoint = Math.floor(
                                          (ranks[ri].list.length - 1) / 2
                                        );
                                        ranks[ri].list.splice(
                                          midpoint,
                                          0,
                                          emojiLoser.id
                                        );
                                        ranks[ri].list.splice(
                                          midpoint,
                                          0,
                                          emojiWinner.id
                                        );
                                      }
                                    }
                                  } else if (
                                    emojiWinner != null &&
                                    emojiLoser != null
                                  ) {
                                    // There are no existing votes, create an entry for the user.
                                    ranks.push({
                                      id: event.userId,
                                      list: [emojiWinner.id, emojiLoser.id],
                                    });
                                  }
                                  database.put('emojiScores', ranks);
                                } else if (
                                  emojiWinner != null &&
                                  emojiLoser != null
                                ) {
                                  // There are absolutely no existing votes for anyone, create an entry for the user.
                                  database.put('emojiScores', [
                                    {
                                      id: event.userId,
                                      list: [emojiWinner.id, emojiLoser.id],
                                    },
                                  ]);
                                }
                                // Finally alter the embed to show a successful vote.
                                let embed = createEmbed();
                                if (emojiWinner != null) {
                                  if (!emojiWinner.animated) {
                                    embed.setTitle(
                                      getString('hotornot_voted').replaceAll(
                                        '%1',
                                        '<:' +
                                          emojiWinner.name +
                                          ':' +
                                          emojiWinner.id +
                                          '>'
                                      )
                                    );
                                  } else {
                                    embed.setTitle(
                                      getString('hotornot_voted_incompatible')
                                    );
                                  }
                                }
                                botEmbed.edit(embed);
                              })
                              .catch(() => {
                                // There was a database error, report to the user.
                                createErrorEmbed(
                                  botEmbed,
                                  getString('hotornot_db_error')
                                );
                              });
                          }
                        })
                        .catch(() => {
                          // There was a database error, report to the user.
                          createErrorEmbed(
                            botEmbed,
                            getString('hotornot_db_error')
                          );
                        });
                    }
                  }
                }
              });
            }
          });
        }
      }
    }
  });
});

async function hotOrNotLeaderboard(
  message: discord.GuildMemberMessage,
  input: string[]
) {
  let database = new pylon.KVNamespace('hotornot');
  database
    .get<string[]>('emojiScores')
    .then((ranks: any[] | undefined) => {
      if (ranks != null) {
        discord.getGuild().then((server) => {
          server.getEmojis().then((emojis) => {
            // Remove incompatible emojis from third-party services.
            let emojiScores: any[] = [];
            for (let i = emojis.length - 1; i >= 0; i--) {
              if (!emojis[i].managed) {
                emojiScores.push({
                  id: emojis[i].id,
                  name: emojis[i].name,
                  score: 0,
                });
              }
            }
            if (emojiScores.length >= 1) {
              // Determine the number of pages and what page to display
              let currentPage = 1;
              if (input.length >= 2) {
                currentPage = parseInt(input[1]);
              }
              let emojisPerPage = 10;
              let pages = Math.ceil(emojiScores.length / emojisPerPage);
              if (currentPage >= 1 && currentPage <= pages) {
                // Invert scores from 0 to max into max to 0.
                for (let i = 0; i < ranks.length; i++) {
                  for (let j = 0; j < ranks[i].list.length; j++) {
                    let ei = emojiScores.findIndex(
                      (element) => element.id == ranks[i].list[j]
                    );
                    if (ei != -1) {
                      emojiScores[ei].score += ranks[i].list.length - 1 - j;
                    }
                  }
                }
                // Sort scores to be displayed.
                emojiScores.sort((a, b) => {
                  if (a.score < b.score) {
                    return 1;
                  }
                  if (a.score > b.score) {
                    return -1;
                  }
                  if (a.name < b.name) {
                    return 1;
                  } else {
                    return -1;
                  }
                });
                // Create the embed.
                let embed = createEmbed();
                embed.setTitle(getString('hotornot_lb_title'));
                embed.setFooter({
                  text: getString('page_numbers')
                    .replaceAll('%1', currentPage)
                    .replaceAll('%2', pages),
                });
                let description = '';
                let index = 0 + (currentPage - 1) * emojisPerPage;
                let maximum = emojiScores.length - index;
                if (maximum > emojisPerPage) {
                  maximum = emojisPerPage;
                }
                function ordinal(n: number) {
                  let s = ['th', 'st', 'nd', 'rd'];
                  let v = n % 100;
                  return s[(v - 20) % 10] || s[v] || s[0];
                }
                for (let i = 0; i < maximum; i++) {
                  description =
                    description +
                    getString('hotornot_lb_row')
                      .replaceAll('%1', index + 1 + i)
                      .replaceAll('%2', ordinal(index + 1 + i))
                      .replaceAll(
                        '%3',
                        '<:' +
                          emojiScores[index + i].name +
                          ':' +
                          emojiScores[index + i].id +
                          '>'
                      )
                      .replaceAll('%4', emojiScores[index + i].name)
                      .replaceAll('%5', emojiScores[index + i].score);
                  if (i < emojisPerPage - 1) {
                    description = description + '\n';
                  }
                }
                embed.setDescription(description);
                message.reply(embed);
              } else {
                createErrorEmbed(
                  message,
                  getString('incorrect_page').replaceAll('%1', pages)
                );
              }
            } else {
              createErrorEmbed(message, getString('hotornot_lacking_emojis'));
            }
          });
        });
      } else {
        createErrorEmbed(message, getString('hotornot_lb_no_users'));
      }
    })
    .catch(() => {
      // There was a database error, report to the user.
      createErrorEmbed(message, getString('hotornot_db_error'));
    });
}

// Purges old embeds to save database space, a scheduled task.
export async function deleteExpiredHotOrNots() {
  let database = new pylon.KVNamespace('hotornot');
  await database.get<any[]>('activeEmbeds').then(async (embeds) => {
    if (embeds != null && embeds.length > 0) {
      let time = new Date().getTime();
      for (let i = embeds.length - 1; i >= 0; i--) {
        if (embeds[i].time + HOTORNOT_TIMEOUT < time) {
          embeds.splice(i, 1);
        }
      }
      database.put('activeEmbeds', embeds);
    }
  });
}
