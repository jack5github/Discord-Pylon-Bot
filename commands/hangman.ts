/* Hangman Game
 * A recreation of the classroom game Hangman.
 * The bot chooses a random word and the user gets a few chances to guess it.
 * Words are derived from random-word-api.herokuapp.com
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  getString,
} from '../global';
import { HANGMAN_CHANCES, HANGMAN_TIMEOUT } from '../config';

createCommand({
  name: 'hangman',
  category: 'fun',
  aliases: ['hang', 'guess', 'word'],
  description: getString('cmd_hangman'),
  longDescription: getString('cmd_hangman_long'),
  args: [
    {
      name: '[letter]',
      description: getString('cmd_hangman_arg_letter'),
    },
  ],
  restrictChannel: true,
  featured: true,
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    hangmanCommand(message, input);
  },
});

async function hangmanCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  // Get the user that sent the message and check if they have an active hangman game.
  let user = message.author.id;
  let database = new pylon.KVNamespace('hangman');
  await database
    .get<any[]>('activeGames')
    .then(async (games) => {
      let game: any = null;
      if (games != null) {
        let gameSearch = (element: any) => element.id == user;
        game = games.find(gameSearch);
      }
      if (game == null) {
        // There is no active hangman game, start one by getting a random word.
        message.reply(getString('hangman_running')).then(async (wipMessage) => {
          let wordApi = await fetch(
            'https://random-word-api.herokuapp.com/word'
          );
          if (wordApi.status != 200) {
            // The request failed to complete.
            wipMessage.delete();
            createErrorEmbed(message, getString('hangman_api_error'));
          } else {
            // The request completed successfully, attempt to create the hangman game.
            let randomWord = await wordApi.json();
            let gameObject = {
              id: user,
              word: randomWord[0],
              guess: '',
              time: new Date().getTime(),
            };
            if (games != null) {
              games.push(gameObject);
              database.put('activeGames', games);
            } else {
              database.put('activeGames', [gameObject]);
            }
            let embed = createEmbed();
            embed.setTitle(
              getString('hangman_start').replaceAll(
                '%1',
                gameObject.word.length
              )
            );
            wipMessage.delete();
            message.reply(embed);
          }
        });
      } else {
        // There is an active hangman game, check if the user has given a letter after determining wrong guesses count.
        let chances = HANGMAN_CHANCES;
        if (game.guess.length != 0) {
          game.guess.split('').forEach(function (guess: string) {
            if (!game.word.includes(guess)) {
              chances -= 1;
            }
          });
        }
        if (input == null) {
          // User has not given input, show the game state.
          let embed = createEmbed();
          embed.setTitle(
            game.word
              .replaceAll(new RegExp('[^' + game.guess + ']', 'g'), '?')
              .toUpperCase()
              .split('')
              .join(' ')
          );
          embed.setDescription(
            getString('hangman_playing') +
              '\n' +
              getString('hangman_status_chances')
                .replaceAll('%1', HANGMAN_CHANCES - chances)
                .replaceAll('%2', chances) +
              '\n' +
              getString('hangman_status_guesses').replaceAll(
                '%1',
                game.guess.toUpperCase().split('').join(', ')
              )
          );
          message.reply(embed);
        } else if (/^[A-Za-z]{1}$/.test(input.join(' '))) {
          // User has given a letter, check if it has already been guessed.
          let letter = input[0].toLowerCase();
          if (!game.guess.includes(letter)) {
            // Attempt to guess a new letter.
            game.guess = game.guess + letter;
            if (game.word.includes(letter)) {
              // Correct guess, check if the whole word has been guessed.
              let rightGuesses = 0;
              game.guess.split('').forEach(function (guess: string) {
                if (game.word.includes(guess)) {
                  rightGuesses += 1;
                }
              });
              // Remove duplicate letters from word to test if user is finished.
              let uniqueLetters = Array.from(new Set(game.word.split('')))
                .toString()
                .replaceAll(',', '');
              if (rightGuesses == uniqueLetters.length) {
                // Entire word guessed, congratulate the user.
                await updateUserHangman(message.author.id, null).then(
                  (status) => {
                    if (status) {
                      let embed = createEmbed();
                      embed.setTitle(getString('hangman_win_title'));
                      embed.setDescription(
                        getString('hangman_win_desc').replaceAll(
                          '%1',
                          game.word.toUpperCase() +
                          '\n' +
                          getString('hangman_status_chances')
                            .replaceAll('%1', HANGMAN_CHANCES - chances)
                            .replaceAll('%2', chances) +
                          '\n' +
                          getString('hangman_status_guesses').replaceAll(
                            '%1',
                            game.guess.toUpperCase().split('').join(', ')
                          )
                      );
                      message.reply(embed);
                    } else {
                      createErrorEmbed(message, getString('hangman_db_error'));
                    }
                  }
                );
              } else {
                // Some letters remain, show the state of the game.
                await updateUserHangman(message.author.id, game.guess).then(
                  (status) => {
                    if (status) {
                      let embed = createEmbed();
                      embed.setTitle(
                        game.word
                          .replaceAll(
                            new RegExp('[^' + game.guess + ']', 'g'),
                            '?'
                          )
                          .toUpperCase()
                          .split('')
                          .join(' ')
                      );
                      embed.setDescription(
                        getString('hangman_input_right').replaceAll(
                          '%1',
                          letter.toUpperCase()
                        ) +
                          '\n' +
                          getString('hangman_status_guesses').replaceAll(
                            '%1',
                            game.guess.toUpperCase().split('').join(', ')
                          )
                      );
                      message.reply(embed);
                    } else {
                      createErrorEmbed(message, getString('hangman_db_error'));
                    }
                  }
                );
              }
            } else {
              // Incorrect guess, check if the user is out of guesses.
              chances -= 1;
              if (chances <= 0) {
                // User is out of guesses, game over.
                await updateUserHangman(message.author.id, null).then(
                  (status) => {
                    if (status) {
                      let embed = createEmbed();
                      embed.setTitle(getString('hangman_lose_title'));
                      embed.setDescription(
                        getString('hangman_lose_desc').replaceAll(
                          '%1',
                          game.word.toUpperCase()
                        ) +
                          '\n' +
                          getString('hangman_status_guesses').replaceAll(
                            '%1',
                            game.guess.toUpperCase().split('').join(', ')
                          )
                      );
                      message.reply(embed);
                    } else {
                      createErrorEmbed(message, getString('hangman_db_error'));
                    }
                  }
                );
              } else {
                // User still has some guesses left.
                await updateUserHangman(message.author.id, game.guess).then(
                  (status) => {
                    if (status) {
                      let embed = createEmbed();
                      embed.setTitle(
                        game.word
                          .replaceAll(
                            new RegExp('[^' + game.guess + ']', 'g'),
                            '?'
                          )
                          .toUpperCase()
                          .split('')
                          .join(' ')
                      );
                      embed.setDescription(
                        getString('hangman_input_wrong').replaceAll(
                          '%1',
                          letter.toUpperCase()
                        ) +
                          '\n' +
                          getString('hangman_status_chances')
                            .replaceAll('%1', HANGMAN_CHANCES - chances)
                            .replaceAll('%2', chances) +
                          '\n' +
                          getString('hangman_status_guesses').replaceAll(
                            '%1',
                            game.guess.toUpperCase().split('').join(', ')
                          )
                      );
                      message.reply(embed);
                    } else {
                      createErrorEmbed(message, getString('hangman_db_error'));
                    }
                  }
                );
              }
            }
          } else {
            // User has given a letter already guessed, show the user what they have guessed.
            createErrorEmbed(
              message,
              getString('hangman_input_exists').replaceAll(
                '%1',
                letter.toUpperCase()
              )
            );
          }
        } else {
          // User has not entered a valid letter, show an error.
          createErrorEmbed(message, getString('hangman_input_error'));
        }
      }
    })
    .catch(() => {
      // There was an error with the database, report this error.
      createErrorEmbed(message, getString('hangman_db_error'));
    });
}

// Responsible for updating and deleting individual hangman games, determined by guesses string.
async function updateUserHangman(userId: string, guesses: string | null) {
  let database = new pylon.KVNamespace('hangman');
  let success = true;
  await database
    .get<any[]>('activeGames')
    .then(async (games) => {
      if (games != null) {
        let gameSearch = (element: any) => element.id == userId;
        let index = games.findIndex(gameSearch);
        if (index != 1) {
          if (guesses != null) {
            // The user's listing was found, update the guesses and time played.
            games[index].guess = guesses;
            games[index].time = new Date().getTime();
          } else {
            // Delete the user's game since it is finished.
            games.splice(index, 1);
          }
          // Update the database with the new status of every user's games.
          await database.put('activeGames', games);
        } else {
          success = false;
        }
      } else {
        success = false;
      }
    })
    .catch(() => {
      success = false;
    });
  if (success) {
    return true;
  }
  // The user's listing was not found or there has been an error.
  return false;
}

// Purges old hangman games to save database space, a scheduled task.
export async function deleteExpiredHangmans() {
  let database = new pylon.KVNamespace('hangman');
  await database.get<any[]>('activeGames').then(async (games) => {
    if (games != null && games.length > 0) {
      let time = new Date().getTime();
      for (let i = games.length - 1; i >= 0; i--) {
        if (games[i].time + HANGMAN_TIMEOUT < time) {
          games.splice(i, 1);
        }
      }
      database.put('activeGames', games);
    }
  });
}
