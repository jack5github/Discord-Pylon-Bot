/* Blackjack Gambling
 * A simple command that plays a game of Blackjack based on the number of cards the user wants to draw.
 * Very rudimentary, could be improved by someone in the future.
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  getString,
} from '../global';

createCommand({
  name: 'blackjack',
  category: 'gambling',
  aliases: ['bj', 'black', 'cards'],
  description: getString('cmd_blackjack'),
  longDescription: getString('cmd_blackjack_long'),
  args: [
    {
      name: '<cards>',
      description: getString('cmd_blackjack_arg_cards'),
    },
  ],
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    blackjackCommand(message, input);
  },
});

async function blackjackCommand(
  message: discord.GuildMemberMessage,
  input: any[] | null
) {
  if (input == null) {
    createErrorEmbed(message, getString('blackjack_no_cards'));
  } else {
    let embed = createEmbed();
    let drawCards = parseInt(input[0]);
    if (!isNaN(drawCards)) {
      if (drawCards >= 2 && drawCards <= 4) {
        let cardsInDeck = [
          getString('blackjack_card_ace'),
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          getString('blackjack_card_jack'),
          getString('blackjack_card_queen'),
          getString('blackjack_card_king'),
        ];
        let cardsDrawn = '';
        let total = 0;
        for (let i = 0; i < drawCards; i++) {
          let randomInt = Math.floor(Math.random() * 13);
          cardsDrawn = cardsDrawn + cardsInDeck[randomInt];
          if (i != drawCards - 1) {
            if (i == drawCards - 2) {
              cardsDrawn = cardsDrawn + ' ' + getString('blackjack_and') + ' ';
            } else {
              cardsDrawn = cardsDrawn + ', ';
            }
          }
          total = total + randomInt + 1;
        }
        cardsDrawn = cardsDrawn.replace(/, $/, '');
        if (total < 22) {
          embed.setTitle(getString('blackjack_win'));
        } else {
          embed.setTitle(getString('blackjack_bust'));
        }
        embed.setDescription(
          getString('blackjack_cards').replaceAll('%1', cardsDrawn) +
            '\n' +
            getString('blackjack_total').replaceAll('%1', total)
        );
        message.reply(embed);
      } else {
        createErrorEmbed(message, getString('blackjack_incorrect_cards'));
      }
    } else {
      createErrorEmbed(message, getString('blackjack_no_cards'));
    }
  }
}
