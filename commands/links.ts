/* Link Commands
 * These commands are intended to be used to quickly recite important links without having to copy and paste them.
 * They can be used in response to other users asking for an easily available link.
 * Alternatively, they can be used to post images and GIFs to chat.
 */

import { createCommand, getString } from '../global';
import { DEV_CHANNEL } from '../config';

let links = [
  {
    name: 'build',
    link: 'http://cdn.lowgif.com/full/c54918ba429ea779-spy-s-sappin-my-mah-sentry-image-gallery-know-your-meme.gif',
    category: 'tf2',
    aliases: ['sentry'],
    description: getString('cmd_links_build'),
    longDescription: getString('cmd_links_build_long'),
  },
  {
    name: 'nope',
    link: 'https://thumbs.gfycat.com/ConcreteGleefulGnu-mobile.mp4',
    category: 'tf2',
    aliases: ['engie', 'engineer', 'nopeavi'],
    description: getString('cmd_links_nope'),
    longDescription: getString('cmd_links_nope_long'),
  },
  {
    name: 'dashboard',
    link: 'https://pylon.bot/studio',
    aliases: ['dash', 'py', 'pylon'],
    description: getString('cmd_links_dashboard'),
    longDescription: getString('cmd_links_dashboard_long'),
    permissions: [discord.Permissions.MANAGE_GUILD],
    devOnly: true,
  },
];

links.forEach((link: any) => {
  if (link.category == null) {
    link.category = 'links';
  }
  createCommand({
    name: link.name,
    category: link.category,
    aliases: link.aliases,
    description: link.description,
    longDescription: link.longDescription,
    devOnly: link.devOnly,
    run: function (
      message: discord.GuildMemberMessage,
      input: string[] | null
    ) {
      if (!link.devOnly || message.channelId == DEV_CHANNEL) {
        message.reply(link.link);
      }
    },
  });
});
