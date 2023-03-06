/* Text to Regional Indicator Converter (Emoji Speak)
 * Converts text passed into the command into exclusively emoji.
 * Characters that cannot be converted are discarded.
 */

import { createCommand, createErrorEmbed, getString } from '../global';

createCommand({
  name: 'emojispeak',
  category: 'chat',
  aliases: ['say', 'speak', 'super', 'superhot'],
  description: getString('cmd_emojispeak'),
  longDescription: getString('cmd_emojispeak_long'),
  args: [
    {
      name: '<text>',
      description: getString('cmd_emojispeak_arg_text'),
    },
  ],
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    emojiSpeakCommand(message, input);
  },
});

async function emojiSpeakCommand(
  message: discord.GuildMemberMessage,
  input: any[] | null
) {
  if (input != null) {
    // Construct the phrase to convert.
    let text = input
      .join(' ') // Join all words with spaces.
      .toLowerCase() // Convert phrase to lower case.
      .replaceAll(/:[^ \n:]+:/g, '') // Remove emoji identifiers.
      .replaceAll(/<[0-9]+>/g, '') // Remove custom emoji containers.
      .replaceAll(/[^a-z0-9 \n]/g, ''); // Remove non-standard characters.
    let max = 40;
    if (text.length > max) {
      createErrorEmbed(
        message,
        getString('emojispeak_too_long').replaceAll('%1', max)
      );
    } else {
      // Convert the phrase to regional indicators.
      let blockText = '';
      let numbers = [
        'zero',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
      ];
      for (let i = 0; i < text.length; i++) {
        if (/[a-z]/.test(text.substring(i, i + 1))) {
          // Symbol is a letter.
          blockText =
            blockText +
            ':regional_indicator_' +
            text.substring(i, i + 1) +
            ': ';
        } else if (/ /.test(text.substring(i, i + 1))) {
          // Symbol is a space, extend it.
          blockText = blockText + '   ';
        } else if (/[0-9]/.test(text.substring(i, i + 1))) {
          // Symbol is a number.
          blockText =
            blockText +
            ':' +
            numbers[parseInt(text.substring(i, i + 1))] +
            ': ';
        } else {
          // Symbol is a new line, force a new line.
          blockText = blockText + '\n';
        }
      }
      if (blockText != '') {
        // Remove trailing space if it exists.
        if (
          blockText.substring(blockText.length - 1, blockText.length) == ' '
        ) {
          blockText = blockText.substring(0, blockText.length - 1);
        }
        await message.reply(blockText);
      } else {
        createErrorEmbed(message, getString('emojispeak_cannot_convert'));
      }
    }
  } else {
    createErrorEmbed(message, getString('emojispeak_empty'));
  }
}
