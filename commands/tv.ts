/* Random YouTube Video TV
 * This command is based on the elusive website neave.tv.
 * On said website, there is a collection of weird out-of-context videos that are randomly shuffled through.
 * This command aims to replicate this with YouTube videos selected and managed by server managers.
 * Videos can be randomly selected, listed or selected with intent by anyone on the server.
 * The list subcommand requires a YouTube API key.
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  doesUserHavePermission,
  getString,
} from '../global';
import { TV_CHANNEL } from '../config';
import { YOUTUBE_API_KEY } from '../secrets';

createCommand({
  name: 'tv',
  category: 'fun',
  aliases: ['neave', 'neavetv', 'randomvideo', 'youtubetv', 'yttv'],
  description: getString('cmd_tv'),
  longDescription: getString('cmd_tv_long'),
  args: [
    { name: 'count', description: getString('cmd_tv_arg_count') },
    { name: 'list [page]', description: getString('cmd_tv_arg_list') },
    {
      name: '[id]',
      description: getString('cmd_tv_arg_id'),
    },
    { name: 'add <urls>', description: getString('cmd_tv_arg_add') },
    {
      name: 'remove <urls>',
      description: getString('cmd_tv_arg_remove'),
    },
  ],
  restrictChannel: true,
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    tvCommand(message, input);
  },
});

async function tvCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  message.getGuild().then((server) => {
    server.getMember(message.author.id).then(async (serverMember) => {
      if (serverMember != null) {
        if (input == null) {
          tvShowRandomVideo(message, null);
        } else if (!isNaN(parseInt(input[0]))) {
          tvShowRandomVideo(message, parseInt(input[0]));
        } else if (input[0] == 'count') {
          tvShowVideoCount(message);
        } else if (input[0] == 'list') {
          let args = null;
          if (input.length >= 2) {
            args = input.slice(1);
          }
          tvShowVideoList(message, args);
        } else if (input[0] == 'add' || input[0] == 'remove') {
          let args = null;
          if (input.length >= 2) {
            args = input.slice(1);
          }
          if (input[0] == 'add') {
            tvAddVideo(message, args);
          } else {
            tvRemoveVideo(message, args);
          }
        } else {
          createErrorEmbed(message, getString('tv_incorrect_arg'));
        }
      }
    });
  });
}

export async function tvShowRandomVideo(
  message: discord.GuildMemberMessage,
  index: number | null
) {
  let database = new pylon.KVNamespace('tv');
  database.get<string[]>('videoIds').then((videos) => {
    if (videos != null) {
      if (index == null) {
        // Get a random video from the list.
        if (message != null) {
          // Respond to the command activated by a user.
          message.reply(
            'https://youtube.com/watch?v=' +
              videos[Math.floor(Math.random() * videos.length)]
          );
        } else {
          // This command has been scheduled, announce to everybody.
          discord.getTextChannel(TV_CHANNEL).then((channel) => {
            if (channel != null) {
              channel.sendMessage(
                'https://youtube.com/watch?v=' +
                  videos[Math.floor(Math.random() * videos.length)]
              );
            }
          });
        }
      } else if (index >= 1 && index <= videos.length) {
        // Get the video from the index the user specified.
        message.reply('https://youtube.com/watch?v=' + videos[index - 1]);
      } else {
        // The user specified an unusable index, show an error.
        createErrorEmbed(message, getString('tv_incorrect_id'));
      }
    } else {
      // Rare edge case: There are no videos in the list.
      createErrorEmbed(message, getString('tv_no_videos'));
    }
  });
}

async function tvShowVideoCount(message: discord.GuildMemberMessage) {
  let database = new pylon.KVNamespace('tv');
  database.get<string[]>('videoIds').then((videos) => {
    if (videos != null) {
      let embed = createEmbed();
      let msg = getString('tv_count').replaceAll('%1', videos.length);
      if (videos.length != 1) {
        msg = msg.replaceAll('%2', 'videos');
      } else {
        msg = msg.replaceAll('%2', 'video');
      }
      embed.setTitle(msg);
      message.reply(embed);
    } else {
      createErrorEmbed(message, getString('tv_no_videos'));
    }
  });
}

async function tvShowVideoList(
  message: discord.GuildMemberMessage,
  input: string | string[] | null
) {
  if (YOUTUBE_API_KEY != null && YOUTUBE_API_KEY.length >= 1) {
    if (input == null || !isNaN(parseInt(input[0]))) {
      // Get the video information.
      let database = new pylon.KVNamespace('tv');
      database.get<string[]>('videoIds').then(async (videos: any) => {
        if (videos != null && videos.length != 0) {
          // Determine the number of pages and what page to display.
          let currentPage = 1;
          if (input != null) {
            currentPage = parseInt(input[0]);
          }
          let videosPerPage = 10;
          let pages = Math.ceil(videos.length / videosPerPage);
          if (currentPage >= 1 && currentPage <= pages) {
            // Get the to-be-displayed video information
            let index = 0 + (currentPage - 1) * videosPerPage;
            let maximum = videos.length - index;
            if (maximum > videosPerPage) {
              maximum = videosPerPage;
            }
            let query = '';
            for (let i = 0; i < maximum; i++) {
              if (i != 0) {
                query += ',';
              }
              query += videos[index + i];
            }
            let url =
              'https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=' +
              query +
              '&key=' +
              YOUTUBE_API_KEY;
            const response = await fetch(url);
            await response
              .json()
              .then((videosInfo) => {
                // Create the embed
                let embed = createEmbed();
                embed.setTitle(getString('tv_list_title'));
                embed.setFooter({
                  text: getString('page_numbers')
                    .replaceAll('%1', currentPage)
                    .replaceAll('%2', pages),
                });
                let description = '';
                for (let i = 0; i < maximum; i++) {
                  description =
                    description +
                    '**#' +
                    (index + 1 + i) +
                    ':** ' +
                    videosInfo.items[i].snippet.channelTitle +
                    ' - ' +
                    videosInfo.items[i].snippet.title;
                  if (i < maximum - 1) {
                    description = description + '\n';
                  }
                }
                embed.setDescription(description);
                message.reply(embed);
              })
              .catch(() => {
                createErrorEmbed(
                  message,
                  getString('tv_list_error')
                    .replaceAll('%1', index + 1)
                    .replaceAll('%2', index + maximum)
                );
              });
          } else {
            createErrorEmbed(
              message,
              getString('tv_list_incorrect_page').replaceAll('%1', pages)
            );
          }
        } else {
          createErrorEmbed(message, getString('tv_no_videos'));
        }
      });
    } else {
      createErrorEmbed(message, getString('tv_list_incorrect_page'));
    }
  } else {
    createErrorEmbed(message, getString('tv_list_api_unset'));
  }
}

async function tvAddVideo(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  let manager = await doesUserHavePermission(
    message,
    discord.Permissions.MANAGE_GUILD
  );
  if (manager) {
    let database = new pylon.KVNamespace('tv');
    database.get<string[]>('videoIds').then((videos) => {
      if (videos != null) {
        if (input != null) {
          let added: string[] = [];
          input.forEach((link) => {
            let match = link.match(/((?<=watch\?v=)|(?<=.be\/))[^&>',]{11}/);
            if (match != null) {
              added.push(match[0].toString());
            }
          });
          if (added.length > 0) {
            added.forEach((add) => {
              videos.push(add);
            });
            database.put('videoIds', videos);
            let embed = createEmbed();
            let msg = getString('tv_add').replaceAll('%1', added.length);
            if (added.length == 1) {
              msg = msg.replaceAll('%2', 'video');
            } else {
              msg = msg.replaceAll('%2', 'videos');
            }
            embed.setTitle(msg);
            message.reply(embed);
          } else {
            createErrorEmbed(message, getString('tv_incorrect_url'));
          }
        } else {
          createErrorEmbed(message, getString('tv_empty'));
        }
      } else {
        createErrorEmbed(message, getString('tv_db_error'));
      }
    });
  } else {
    createErrorEmbed(message, getString('no_permission'));
  }
}

async function tvRemoveVideo(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  let manager = await doesUserHavePermission(
    message,
    discord.Permissions.MANAGE_GUILD
  );
  if (manager) {
    let database = new pylon.KVNamespace('tv');
    database.get<string[]>('videoIds').then((videos) => {
      if (input != null) {
        let removed = 0;
        let errors = 0;
        input.forEach((link) => {
          let match = link.match(/((?<=watch\?v=)|(?<=.be\/))[^&>',]{11}/);
          if (match != null) {
            let id = match[0].toString();
            if (videos != null && videos.length != 0) {
              let prdct = (element: string) => element == id;
              let index = videos.findIndex(prdct);
              if (index != -1) {
                if (index == 0) {
                  videos = videos.slice(1);
                } else if (index == videos.length - 1) {
                  videos = videos.slice(0, videos.length - 1);
                } else {
                  videos = videos
                    .slice(0, index)
                    .concat(videos.slice(index + 1, videos.length));
                }
                database.put('videoIds', videos);
                removed += 1;
              } else {
                errors += 1;
              }
            }
          } else {
            errors += 1;
          }
        });
        if (removed != 0) {
          let embed = createEmbed();
          let msg = getString('tv_remove').replaceAll('%1', removed);
          if (removed == 1) {
            msg = msg.replaceAll('%2', 'video');
          } else {
            msg = msg.replaceAll('%2', 'videos');
          }
          embed.setTitle(msg);
          message.reply(embed);
        } else {
          createErrorEmbed(message, getString('tv_incorrect_url'));
        }
      } else {
        createErrorEmbed(message, getString('tv_empty'));
      }
    });
  } else {
    createErrorEmbed(message, getString('no_permission'));
  }
}
