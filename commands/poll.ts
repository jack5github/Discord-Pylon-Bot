/* Poll Creator
 * Quickly create a yes or no, or up to 10-choice poll using this command.
 * Follow the command with a number to create a numbered-choice poll.
 */

import { createCommand, createErrorEmbed, getString } from '../global';

createCommand({
  name: 'poll',
  category: 'chat',
  aliases: ['choice', 'choices', 'contest', 'decide', 'yesno'],
  description: getString('cmd_poll'),
  args: [
    {
      name: '[choices]',
      description: getString('cmd_poll_arg_choices'),
    },
  ],
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    pollCommand(message, input);
  },
});

async function pollCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  if (input == null || isNaN(parseInt(input[0]))) {
    // Input is non-existant or is not a number, create a yes or no poll.
    message.addReaction('✅').then(async () => {
      await message.addReaction('❎');
    });
  } else {
    // Input is a number, try to create a numbered poll.
    let inputInt = parseInt(input[0]);
    if (inputInt >= 2 && inputInt <= 10) {
      message.addReaction('1️⃣').then(async () => {
        await message.addReaction('2️⃣').then(async () => {
          if (inputInt >= 3) {
            await message.addReaction('3️⃣').then(async () => {
              if (inputInt >= 4) {
                await message.addReaction('4️⃣').then(async () => {
                  if (inputInt >= 5) {
                    await message.addReaction('5️⃣').then(async () => {
                      if (inputInt >= 6) {
                        await message.addReaction('6️⃣').then(async () => {
                          if (inputInt >= 7) {
                            await message.addReaction('7️⃣').then(async () => {
                              if (inputInt >= 8) {
                                await message
                                  .addReaction('8️⃣')
                                  .then(async () => {
                                    if (inputInt >= 9) {
                                      await message
                                        .addReaction('9️⃣')
                                        .then(async () => {
                                          if (inputInt >= 10) {
                                            await message.addReaction('🔟');
                                          }
                                        });
                                    }
                                  });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      });
    } else {
      // Only a number of choices between 2 and 10 is acceptable.
      createErrorEmbed(message, getString('poll_incorrect_choices'));
    }
  }
}
