/* Jazztronauts Minigame
 * Every day a collection of props are spawned which users can race to destroy.
 * Destroyed props are worth certain amounts of currency.
 */

import {
  createCommand,
  createEmbed,
  createErrorEmbed,
  doesUserHavePermission,
  getString,
} from '../global';
import {
  ECONOMY_JAZZ_OBJECTS_MINIMUM,
  ECONOMY_JAZZ_OBJECTS_MAXIMUM,
  ECONOMY_JAZZ_OUTSIDE_CHANCE,
  ECONOMY_JAZZ_REWARD_SMALL_MINIMUM,
  ECONOMY_JAZZ_REWARD_SMALL_MAXIMUM,
  ECONOMY_JAZZ_REWARD_LARGE_MINIMUM,
  ECONOMY_JAZZ_REWARD_LARGE_MAXIMUM,
  ECONOMY_JAZZ_REWARD_WORLD_MULTIPLIER,
  ECONOMY_JAZZ_REWARD_BONUS_MULTIPLIER,
} from '../config';

createCommand({
  name: 'jazz',
  category: 'fun',
  aliases: ['jazztronauts', 'object', 'objects'],
  description: getString('cmd_jazz').replaceAll(
    '%1',
    'points'
  ),
  longDescription: getString('cmd_jazz_long').replaceAll(
    '%1',
    'points'
  ),
  args: [
    { name: '[object]', description: getString('cmd_jazz_arg_object') },
    {
      name: 'lb [page]',
      description: getString('cmd_jazz_arg_lb').replaceAll(
        '%1',
        'points'
    },
    { name: 'respawn', description: getString('cmd_jazz_arg_respawn') },
  ],
  run: function (message: discord.GuildMemberMessage, input: string[] | null) {
    jazzCommand(message, input);
  },
});

class JazzObject {
  name: string; // How to reference an object when attempting to destroy it.
  prop: boolean; // False if the object is an unmovable solid.
  out: boolean; // True if the object can only be found outside.
  /* The size of the object, reference below:
   * 1 - The size of a mobile phone.
   * 2 - Around twice the height of a mobile phone.
   * 3 - Around four times the height of a mobile phone and twice as wide.
   * 4 - The size of an average-sized vertical rectangular window.
   * 5 - The size of an average door.
   * 6 - Around twice the width of an average door.
   * 7 - Around four times the width of an average door.
   * 8 - Around four times the width of an average door and twice as tall, or greater.
   */
  size: number;
  min: number; // How many of the object to spawn at minimum.
  chance: number; // The chance of the object to spawn after minimum spawns.
  bonus: boolean; // Whether the object is innately special and should give a greater reward than normal.
  constructor({
    name = 'unnamed_prop',
    prop = true,
    out = false,
    size = 0,
    min = 0,
    chance = 1,
    bonus = false,
  } = {}) {
    this.name = name;
    this.prop = prop;
    this.out = out;
    this.size = size;
    this.min = min;
    this.chance = chance;
    this.bonus = bonus;
  }
}

let objects: JazzObject[] = [
  new JazzObject({ name: 'floor', prop: false, size: 7, min: 1, chance: 8 }),
  new JazzObject({
    name: 'ground',
    prop: false,
    out: true,
    size: 8,
    chance: 6,
  }),
  new JazzObject({
    name: 'road',
    prop: false,
    out: true,
    size: 7,
    chance: 2,
  }),
  new JazzObject({ name: 'wall', prop: false, size: 7, min: 4, chance: 16 }),
  new JazzObject({ name: 'ceiling', prop: false, size: 7, min: 1, chance: 8 }),
  new JazzObject({
    name: 'roof',
    prop: false,
    out: true,
    size: 8,
    chance: 6,
  }),
  new JazzObject({
    name: 'sky',
    prop: false,
    out: true,
    size: 8,
    chance: 6,
  }),
  new JazzObject({ name: 'chimney', size: 4, chance: 1 }),
  new JazzObject({ name: 'light', size: 3, chance: 8 }),
  new JazzObject({ name: 'desk_light', size: 2, chance: 1 }),
  new JazzObject({ name: 'fluorescent_light', size: 3, chance: 2 }),
  new JazzObject({ name: 'spotlight', size: 2, chance: 1 }),
  new JazzObject({ name: 'door', size: 5, chance: 8 }),
  new JazzObject({ name: 'sliding_door', size: 5, chance: 1 }),
  new JazzObject({ name: 'metal_door', size: 6, chance: 1 }),
  new JazzObject({ name: 'window', size: 3, chance: 6 }),
  new JazzObject({ name: 'sliding_window', size: 4, chance: 2 }),
  new JazzObject({ name: 'chair', size: 3, chance: 8 }),
  new JazzObject({ name: 'office_chair', size: 3, chance: 2 }),
  new JazzObject({ name: 'gaming_chair', size: 4, chance: 1 }),
  new JazzObject({ name: 'couch', size: 7, chance: 2 }),
  new JazzObject({ name: 'television', size: 3, chance: 1 }),
  new JazzObject({ name: 'monitor', size: 4, chance: 1 }),
  new JazzObject({ name: 'computer', size: 3, chance: 1 }),
  new JazzObject({ name: 'laptop', size: 3, chance: 1 }),
  new JazzObject({ name: 'bed', size: 7, chance: 4 }),
  new JazzObject({ name: 'globe', size: 2, chance: 1 }),
  new JazzObject({ name: 'phone', size: 2, chance: 2 }),
  new JazzObject({ name: 'mobile_phone', size: 1, chance: 4 }),
  new JazzObject({ name: 'camera', size: 1, chance: 1 }),
  new JazzObject({ name: 'security_camera', size: 2, chance: 2 }),
  new JazzObject({ name: 'clock', size: 2, chance: 1 }),
  new JazzObject({ name: 'digital_clock', size: 1, chance: 2 }),
  new JazzObject({ name: 'radio', size: 2, chance: 1 }),
  new JazzObject({ name: 'drawers', size: 4, chance: 8 }),
  new JazzObject({ name: 'shelves', size: 4, chance: 2 }),
  new JazzObject({ name: 'cabinet', size: 3, chance: 2 }),
  new JazzObject({ name: 'cupboard', size: 6, chance: 4 }),
  new JazzObject({ name: 'lockers', size: 4, chance: 1 }),
  new JazzObject({ name: 'fridge', size: 5, chance: 1 }),
  new JazzObject({ name: 'freezer', size: 5, chance: 1 }),
  new JazzObject({ name: 'kettle', size: 2, chance: 1 }),
  new JazzObject({ name: 'toaster', size: 2, chance: 1 }),
  new JazzObject({ name: 'microwave', size: 2, chance: 1 }),
  new JazzObject({ name: 'sink', size: 4, chance: 2 }),
  new JazzObject({ name: 'toilet', size: 4, chance: 2 }),
  new JazzObject({ name: 'bathtub', size: 6, chance: 2 }),
  new JazzObject({ name: 'shower', size: 5, chance: 2 }),
  new JazzObject({ name: 'dishwasher', size: 4, chance: 1 }),
  new JazzObject({ name: 'washing_machine', size: 4, chance: 1 }),
  new JazzObject({ name: 'dryer', size: 4, chance: 1 }),
  new JazzObject({ name: 'bucket', size: 2, chance: 1 }),
  new JazzObject({ name: 'brick', size: 2, chance: 2 }),
  new JazzObject({ name: 'concrete_brick', size: 2, chance: 4 }),
  new JazzObject({ name: 'vending_machine', size: 5, chance: 1 }),
  new JazzObject({ name: 'bottle', size: 1, chance: 8 }),
  new JazzObject({ name: 'soda_can', size: 1, chance: 4 }),
  new JazzObject({ name: 'barrel', size: 4, chance: 2 }),
  new JazzObject({ name: 'water_barrel', size: 4, chance: 2 }),
  new JazzObject({ name: 'explosive_barrel', size: 4, chance: 2 }),
  new JazzObject({ name: 'package', size: 2, chance: 1 }),
  new JazzObject({ name: 'cardboard_box', size: 2, chance: 2 }),
  new JazzObject({ name: 'crate', size: 3, chance: 1 }),
  new JazzObject({ name: 'milk_crate', size: 2, chance: 4 }),
  new JazzObject({ name: 'pet_carrier', size: 3, chance: 1 }),
  new JazzObject({ name: 'sign', size: 3, chance: 1 }),
  new JazzObject({ name: 'road_sign', out: true, size: 2, chance: 2 }),
  new JazzObject({ name: 'fence', size: 4, chance: 4 }),
  new JazzObject({
    name: 'chainlink_fence',
    out: true,
    size: 6,
    chance: 2,
  }),
  new JazzObject({ name: 'ladder', size: 5, chance: 1 }),
  new JazzObject({ name: 'propane_tank', size: 3, chance: 1 }),
  new JazzObject({ name: 'gasoline', size: 3, chance: 2 }),
  new JazzObject({ name: 'pipe', size: 3, chance: 8 }),
  new JazzObject({ name: 'valve', size: 2, chance: 1 }),
  new JazzObject({ name: 'sawblade', size: 4, chance: 1 }),
  new JazzObject({ name: 'rubbish_bin', size: 4, chance: 2 }),
  new JazzObject({ name: 'trash_can', size: 3, chance: 2 }),
  new JazzObject({ name: 'dumpster', size: 7, chance: 1 }),
  new JazzObject({ name: 'fountain', out: true, size: 7, chance: 1 }),
  new JazzObject({ name: 'shrub', out: true, size: 3, chance: 4 }),
  new JazzObject({ name: 'bush', out: true, size: 4, chance: 4 }),
  new JazzObject({ name: 'tree', out: true, size: 8, chance: 2 }),
  new JazzObject({ name: 'garden_gnome', size: 2, chance: 1, bonus: true }),
  new JazzObject({ name: 'statue', size: 5, chance: 1 }),
  new JazzObject({ name: 'pillar', size: 5, chance: 4 }),
  new JazzObject({ name: 'tombstone', out: true, size: 3, chance: 1 }),
  new JazzObject({ name: 'utility_pole', out: true, size: 7, chance: 2 }),
  new JazzObject({ name: 'traffic_cone', size: 3, chance: 2 }),
  new JazzObject({ name: 'roadblock', size: 4, chance: 2 }),
  new JazzObject({ name: 'tyre', size: 3, chance: 1 }),
  new JazzObject({ name: 'car', size: 7, chance: 1 }),
  new JazzObject({ name: 'jeep', out: true, size: 7, chance: 1 }),
  new JazzObject({ name: 'truck', out: true, size: 8, chance: 1 }),
  new JazzObject({ name: 'boat', out: true, size: 8, chance: 1 }),
  new JazzObject({
    name: 'shipping_container',
    out: true,
    size: 8,
    chance: 1,
  }),
  new JazzObject({ name: 'suit', size: 4, chance: 1 }),
  new JazzObject({ name: 'kleiner', size: 4, chance: 1, bonus: true }),
  new JazzObject({ name: 'dinosaur_plush', size: 2, chance: 1, bonus: true }),
];

let maxSize = 1;
let maxChance = 1;
objects.forEach((obj) => {
  if (maxSize < obj.size) {
    maxSize = obj.size;
  }
  if (maxChance < obj.chance) {
    maxChance = obj.chance;
  }
});

let JAZZ_PILLAGE_COOLDOWN = 5 * 60000; // 5 minutes.

async function jazzCommand(
  message: discord.GuildMemberMessage,
  input: string[] | null
) {
  if (input == null) {
    showJazzObjects(message, false);
  } else if (input[0] == 'lb' || input[0] == 'leaderboard') {
    input.splice(0, 1);
    showJazzLeaderboard(message, input);
  } else if (input[0] == 'respawn') {
    let manager = await doesUserHavePermission(
      message,
      discord.Permissions.MANAGE_GUILD
    );
    if (manager) {
      spawnJazzObjects()
        .then(() => {
          showJazzObjects(message, true);
        })
        .catch(() => {
          createErrorEmbed(message, getString('jazz_respawn_error'));
        });
    } else {
      createErrorEmbed(message, getString('no_permission'));
    }
  } else {
    pillageJazzObject(message, input[0]);
  }
}

export async function spawnJazzObjects() {
  let objs: string[] = [];
  let objCount = Math.floor(
    Math.random() *
      (ECONOMY_JAZZ_OBJECTS_MAXIMUM - ECONOMY_JAZZ_OBJECTS_MINIMUM) +
      ECONOMY_JAZZ_OBJECTS_MINIMUM
  );
  let outside = Math.floor(Math.random());
  objects.forEach((obj) => {
    // Spawn all objects that must be spawned at minimum.
    if (obj.min > 0) {
      // Do not attempt to spawn the object if the map is inside and it is an outside object.
      if (outside < ECONOMY_JAZZ_OUTSIDE_CHANCE || !obj.out) {
        for (let i = 0; i < obj.min; i++) {
          if (objCount > 0) {
            objs.splice(Math.floor(Math.random() * objs.length), 0, obj.name);
            objCount--;
          }
        }
      }
    }
  });
  while (objCount > 0) {
    // Spawn the remaining objects required to meet the quota.
    let decided = false;
    do {
      // Do not attempt to spawn the object if the map is inside and it is an outside object.
      let obj = objects[Math.floor(Math.random() * objects.length)];
      if (!outside || !obj.out) {
        // Only spawn the object if it passes a chance roll.
        if (Math.random() * maxChance <= obj.chance) {
          objs.splice(Math.floor(Math.random() * objs.length), 0, obj.name); // Place it at a random index.
          decided = true;
        }
      }
    } while (!decided);
    objCount--;
  }
  // Save the spawned objects to the database.
  let database = new pylon.KVNamespace('jazz');
  await database.put('spawnedObjects', objs).catch(() => {
    // There was an error saving to the database, but there is no message to reply to.
    throw Error;
  });
}

export async function showJazzObjects(
  message: discord.GuildMemberMessage | null,
  respawned: boolean
) {
  let database = new pylon.KVNamespace('jazz');
  database.get<string[]>('spawnedObjects').then((objs) => {
    if (objs != null && objs.length != 0) {
      let embed = createEmbed();
      embed.setImage({
        url: 'https://static.tvtropes.org/pmwiki/pub/images/jazztronauts_logo.png',
      });
      let description = '';
      if (!respawned) {
        // Respond to the command activated by a user.
        embed.setTitle(getString('jazz_title'));
        description = getString('jazz_desc') + '\n```fix\n';
      } else {
        // This command has been scheduled, announce to everybody.
        embed.setTitle(getString('jazz_title_daily'));
        description = getString('jazz_desc_daily') + '\n```fix\n';
      }
      objs.forEach((obj) => {
        description += obj + ', ';
      });
      description = description.substring(0, description.length - 2) + '```';
      embed.setDescription(description);
      if (message != null) {
        // Respond to the command activated by a user.
        message.reply(embed);
      } else {
        // This command has been scheduled, announce to everybody.
        discord.getTextChannel('1012589938224668753').then((channel) => {
          if (channel != null) {
            channel.sendMessage(embed);
          }
        });
      }
    } else if (message != null) {
      createErrorEmbed(message, getString('jazz_no_objects'));
    }
  });
}

async function showJazzLeaderboard(
  message: discord.GuildMemberMessage,
  input: string[]
) {
  let database = new pylon.KVNamespace('jazz');
  database
    .get<any[]>('leaderboard')
    .then(async (users) => {
      if (users != null && users.length >= 1) {
        // Determine the number of pages and what page to display
        let currentPage = 1;
        if (input.length >= 1) {
          currentPage = parseInt(input[0]);
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
          embed.setTitle('Jazztronauts!! Leaderboard');
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
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
          }
          for (let i = 0; i < maximum; i++) {
            description =
              description +
              '**' +
              ordinal(index + 1 + i) +
              ':** <@' +
              users[index + i].id +
              '> - ' +
              users[index + i].amount +
              ' points';
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
        await createErrorEmbed(message, getString('jazz_lb_no_users'));
      }
    })
    .catch(async () => {
      await createErrorEmbed(message, getString('jazz_lb_error'));
    });
}

async function pillageJazzObject(
  message: discord.GuildMemberMessage,
  pillage: string
) {
  let database = new pylon.KVNamespace('jazz');
  database.get<string[]>('spawnedObjects').then(async (objs) => {
    if (objs != null && objs.length != 0) {
      // Search for the object that needs to be pillaged.
      let objectSearch = (element: any) => element == pillage;
      let index = objs.findIndex(objectSearch);
      if (index != -1) {
        // An object to pillage has been found, check if the user is able to do so right now.
        let timedOut = await jazzIsUserTimedOut(message);
        if (timedOut == 0) {
          // Find the object in the object encyclopedia.
          objectSearch = (element: any) => element.name == pillage;
          let object = objects.find(objectSearch);
          if (object != null) {
            /* An object can be pillaged and it is in the encyclopedia, get information about it.
             * Objects give currency mainly based on their size.
             * Non-props and bonus objects have multiplier which further adjust their reward.
             */
            // Get the size of the object on a scale from 0 to 1.
            let scale = (object.size - 1) / (maxSize - 1);
            if (scale < 0) {
              scale = 0;
            } else if (scale > 1) {
              scale = 1;
            }
            // Convert this scale into the minimum and maximum random values.
            let min =
              ECONOMY_JAZZ_REWARD_LARGE_MINIMUM * scale +
              ECONOMY_JAZZ_REWARD_SMALL_MINIMUM * (1 - scale);
            let max =
              ECONOMY_JAZZ_REWARD_LARGE_MAXIMUM * scale +
              ECONOMY_JAZZ_REWARD_SMALL_MAXIMUM * (1 - scale);
            // Calculate the reward and apply bonuses or penalties if necessary.
            let reward = Math.random() * (max - min) + min;
            if (!object.prop) {
              reward = reward * ECONOMY_JAZZ_REWARD_WORLD_MULTIPLIER;
            }
            if (object.bonus) {
              reward = reward * ECONOMY_JAZZ_REWARD_BONUS_MULTIPLIER;
            }
            // Ensure the reward is a whole number above 0.
            reward = Math.round(reward);
            if (reward < 1) {
              reward = 1;
            }
            // Finally, reward the user and pillage the object
            let rewardStatus = await addJazzPoints(message.author.id, reward);
            if (rewardStatus == 1) {
              objs.splice(index, 1);
              database.put('spawnedObjects', objs).then(async () => {
                // Object was pillaged, tell the user.
                let embed = createEmbed();
                let msg = getString('jazz_pillage_with_reward')
                  .replaceAll('%1', pillage)
                  .replaceAll('%2', reward);
                if (reward != 1) {
                  msg = msg.replaceAll('%3', 'points');
                } else {
                  msg = msg.replaceAll('%3', 'point');
                }
                embed.setTitle(msg);
                message.reply(embed);
              });
            } else {
              // There was a database error.
              createErrorEmbed(message, getString('jazz_pillage_error'));
            }
          }
        } else if (timedOut > 0) {
          // The user is pillaging too fast.
          let minutes = Math.ceil(timedOut / 60000);
          let msg = getString('jazz_user_timeout').replaceAll('%1', minutes);
          if (minutes > 1) {
            msg = msg.replaceAll('%2', getString('minutes_name'));
          } else {
            msg = msg.replaceAll('%2', getString('minutes_name_single'));
          }
          createErrorEmbed(message, msg);
        } else {
          // There was a database error.
          createErrorEmbed(message, getString('jazz_pillage_error'));
        }
      } else {
        // The object to pillage could not be found.
        createErrorEmbed(message, getString('jazz_unknown_object'));
      }
    } else {
      // There are likely no objects left.
      createErrorEmbed(message, getString('jazz_no_objects'));
    }
  });
}

// User timeout functions - Sets limits on how fast a user can use commands.
async function jazzIsUserTimedOut(message: discord.GuildMemberMessage) {
  return new Promise<number>((resolve) => {
    let database = new pylon.KVNamespace('jazz');
    database
      .get<any[]>('timedOut')
      .then((users) => {
        let time = new Date().getTime();
        if (users != null) {
          let userSearch = (element: any) => (element.id = message.author.id);
          let index = users.findIndex(userSearch);
          if (index != null) {
            let cooldownTime = users[index].date + JAZZ_PILLAGE_COOLDOWN;
            if (cooldownTime < time) {
              // Rare edge case: User is on the list but is not spamming, do not edit the list.
              users[index].date = time;
              jazzTimeoutUser(users, message.author.id);
              resolve(0);
            } else {
              // User is on the list and is spamming, warn them. Return the amount of time they must wait.
              resolve(users[index].date + JAZZ_PILLAGE_COOLDOWN - time);
            }
          } else {
            // User is not on the list, add them to the list.
            users.push({ id: message.author.id, date: time });
            jazzTimeoutUser(users, message.author.id);
            resolve(0);
          }
        } else {
          // Rare edge case: The list is uninitialised, initialise it with the user.
          jazzTimeoutUser(
            [{ id: message.author.id, date: time }],
            message.author.id
          );
          resolve(0);
        }
      })
      .catch((err) => {
        // There was an error with the database, do not allow the user to continue.
        resolve(-1);
      });
  });
}
async function jazzTimeoutUser(array: any[], id: string) {
  // Timeout user, untimeout not necessary.
  let database = new pylon.KVNamespace('jazz');
  await database.put('timedOut', array);
}

async function addJazzPoints(userId: string, points: number) {
  let database = new pylon.KVNamespace('jazz');
  let success = true;
  await database
    .get<any[]>('leaderboard')
    .then(async (users) => {
      if (users != null) {
        let userSearch = (element: any) => element.id == userId;
        let index = users.findIndex(userSearch);
        if (index != -1) {
          // The user's listing was found, update the amount.
          users[index].amount += points;
        } else {
          // The user's listing was not found, add a new listing.
          users.push({
            id: userId,
            amount: points,
          });
        }
      } else {
        // The database has not been initialised, create it with a new listing.
        users = [
          {
            id: userId,
            amount: points,
          },
        ];
      }
      // Update the database with the new status of every user's points.
      await database.put('leaderboard', users).catch(() => {
        success = false;
      });
    })
    .catch(() => {
      success = false;
    });
  if (success) {
    return 1;
  }
  return -1; // There was an error with the database, report this error.
}
