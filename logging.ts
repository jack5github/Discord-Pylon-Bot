/* This file logs all messages sent in the server to the Pylon console.
 * It is necessary at times to see what action caused a response from the bot.
 * Logs are not saved the next time this code editor is loaded.
 */

discord.on('MESSAGE_CREATE', async (message) => {
  // Log messages by other users that have text content in the console
  if (message.author.id != discord.getBotId() && message.content != '') {
    console.log(
      message.author.username +
        '#' +
        message.author.discriminator +
        ': ' +
        message.content
    );
  }
});
