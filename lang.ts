/* This file contains all of the strings used by the bot.
 * It exists so that the language the bot uses may easily be changed by someone who is not code-savvy.
 * %1, %2, %3 etc. are replaced with dynamic information depending on the string.
 * By using an array of strings rather than a single string, a random one is returned.
 */

export const dictionary: any = {
  /*
   * Global strings.
   */
  unknown_cmd:
    'No command with the name `%1` could be found. Try using the `help` command.',
  no_permission: 'You do not have permission to use this command.',
  incorrect_channel: 'That command cannot be used in this channel.',
  unknown_user:
    'No user could be found with that info. Try copying an ID, or simply leaving the ID blank to point to yourself.',
  minutes_name: 'minutes',
  minutes_name_single: 'minute',
  page_numbers: 'Page %1 of %2',
  incorrect_page:
    'There are only %1 pages. Please enter a valid page number, or no number to view the first page.',
  // Help main page strings.
  help_title: '%1 Commands Hub',
  help_desc:
    'To view info about a specific command or category, type its name after the `help` command.',
  help_incorrect:
    'No command or category called `%1` could be found. Double-check its name in the help menu and try again.',
  help_no_categories: 'No categories exist. Please contact a server manager.',
  help_default_desc: '*No description*',
  category_default_title: 'New Commands',
  category_default_desc: "These commands haven't been categorised yet.",
  category_chat_title: 'Chat Commands',
  category_chat_desc: 'Commands that can spice up ordinary conversations!',
  category_chat_desc_long:
    'There may come times where simple conversations are not enough, and these commands are perfect for enhancing your usual chats!',
  category_economy_title: 'Economy & Games',
  category_economy_desc: 'Use or earn %1, and play games with others!',
  category_economy_desc_long:
    "With these commands, you're able to both earn %1 as a gift and by playing games, but also use it to get Discord rewards!",
  category_fun_title: 'Just For Fun',
  category_fun_desc: 'Little distractions that are just for fun!',
  category_fun_desc_long:
    'Looking for a great time with just yourself and the bot? Look no further than these distractions, which are just for fun!',
  category_links_title: 'Quick Links',
  category_links_desc: 'Easy access to important webpages.',
  category_links_desc_long:
    'In a rush and not wanting to use Google? Not to worry, just type one of these commands and the relevant link will be posted!',
  category_system_title: 'System Commands',
  category_system_desc: 'Inspect the inner workings of the bot.',
  category_system_desc_long:
    'Developing this bot takes time and effort, and this is all done for free. Please consider supporting the developers.',
  category_tf2_title: 'Team Fortress 2',
  category_tf2_desc:
    'Commands related to the class-based first-person shooter.',
  category_tf2_desc_long:
    'You can find all the commands related to the well-renowned class-based first-person shooter right here in this category!',
  /*
   * Help category and command page strings.
   */
  help_cmd_aliases: '*Also works as:*',
  help_cmd_args: '*Arguments:*',
  help_cmd_restrict_channel:
    "⚠️ *This command can only be run in the bot's dedicated channels.*",
  help_no_cmds_in_category:
    'No commands could be found in that category. Please contact a server manager.',
  cmd_eightball: 'Get your fortune told from The Magic 8-Ball.',
  cmd_eightball_long:
    "Got a question that you want a second opinion on? Get your or someone else's fortune told from The Magic 8-Ball.",
  cmd_avatar: "Links your or another user's high-quality avatar.",
  cmd_avatar_long:
    "No need to search how to grab a Discord user's avatar, this command will do it for you.",
  cmd_avatar_arg_user:
    'See the avatar of another user. Copy their ID by enabling Developer Mode in your advanced Discord settings.',
  cmd_cat: 'Everybody has a unique cat, find out what yours is!',
  cmd_cat_long:
    'Ever wondered what you might look like as a cat? This command will show you! Everybody has a unique cat, find out what yours is!',
  cmd_cat_arg_user:
    'See the cat of another user. Copy their ID by enabling Developer Mode in your advanced Discord settings.',
  cmd_dadjoke: "There's nothing quite like a good dad joke!",
  cmd_dadjoke_long:
    "If you need a chuckle, use this command! It will fetch you a random dad joke that's sure to put you in stitches!",
  cmd_emojispeak: 'Transforms your text into regional indicators.',
  cmd_emojispeak_long:
    'Enter a message into this command and it will be converted into large letters and numbers (regional indicators)!',
  cmd_emojispeak_arg_text:
    'The text you want to convert. Only letters, numbers, spaces and new lines are converted.',
  cmd_flip: 'Flip a coin to see how lucky you are.',
  cmd_flip_long:
    "Can't make a decision or just want to see how lucky you are? This simple command will flip a coin for you.",
  cmd_help: 'View all of the commands and access info about them.',
  cmd_help_long:
    "With this command you can preview every other command and access info about them. But you already knew that, didn't you?",
  cmd_help_arg_topic: 'The command or category to learn more about.',
  cmd_hug: 'Reply to a message to give that user a hug!',
  cmd_hug_long:
    'Sometimes you need to show your appreciation to another user. With this command you can give them a hug by replying to them!',
  cmd_jazz: 'Pillage objects and earn %1 by playing Jazztronauts!!',
  cmd_jazz_long:
    'In Jazztronauts!!, you pillage objects to earn %1, but watch out, everyone else wants to as well! Objects are respawned at 10 am AEST.',
  cmd_jazz_arg_object: 'The object you wish to pillage.',
  cmd_jazz_arg_lb: 'Opens the leaderboard of how many %1 each user has earnt.',
  cmd_jazz_arg_respawn: 'Respawns objects ahead of time. (Managers only)',
  cmd_links_build: 'Build a Sentry, right in the chat!',
  cmd_links_build_long:
    'This command posts an animated picture of a Sentry being built.',
  cmd_links_dashboard:
    "Preview and edit this bot's programming. (Managers only)",
  cmd_links_dashboard_long:
    'This command posts the link to the bot dashboard, where its code can be adjusted. (Managers only)',
  cmd_links_nope: 'See the majestic neck of the Engineer himself.',
  cmd_links_nope_long:
    "This command posts an animated picture of the Engineer's neck extending from 'nope.avi'.",
  cmd_medic: 'Randomly call for a Medic!',
  cmd_medic_long:
    'Do you need a Medic? Use this command to call for one using a random Team Fortress 2 class voice line!',
  cmd_poll: 'Create a poll and allow other users to vote.',
  cmd_poll_long:
    'This command creates a yes-no or multiple-choice poll for other users to vote on.',
  cmd_poll_arg_choices: 'Sets the number of choices between 2 and 10.',
  cmd_roll: 'Roll a customisable die.',
  cmd_roll_long:
    'This command allows you to roll a customisable die. The die is 6-sided by default, but you can change it to any positive whole number.',
  cmd_roll_arg_sides: 'Set how many sides the die has.',
  cmd_rps: 'Start a Rock, Paper, Scissors battle.',
  cmd_rps_long:
    'Do you dare challenge the bot to a game of Rock, Paper, Scissors? Try this command and see how lucky you are.',
  cmd_rps_arg_hand: 'Either rock, paper or scissors.',
  cmd_steamgame: 'Picks a random Steam game for you to check out.',
  cmd_steamgame_long:
    "Can't decide on what to play? Use this command to be recommended a random game from someone's library.",
  cmd_steamgame_arg_steamid64:
    'Add a steamid64 from https://steamid.io to change the library.',
  cmd_support: 'Contact the bot developer to make suggestions and bug reports.',
  cmd_support_long:
    "Use this command to contact the bot developer. Do this if you're wishing to make suggestions or bug reports, or just want to show your support.",
  cmd_tv: 'Be linked to a random, curated YouTube video.',
  cmd_tv_long:
    'Are you feeling lucky? Tune into this TV channel and be linked to a random, curated YouTube video.',
  cmd_tv_arg_add: 'Add a video to the list. (Managers only)',
  cmd_tv_arg_count: 'See the total number of videos.',
  cmd_tv_arg_id: 'Add a video index from the list to get it embedded.',
  cmd_tv_arg_list: 'See the list of videos.',
  cmd_tv_arg_remove: 'Remove a video from the list. (Managers only)',
  /*
   * Command-specific strings.
   */
  eightball_message: '🎱 The Magic 8-Ball says: "%1"',
  eightball_response: [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes - definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    "Don't count on it.",
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.',
  ],
  dadjoke_api_error:
    'A dad joke could not be retrieved, the joke server may be down. Please try again later.',
  emojispeak_empty:
    'Type a message after the command that you want to convert into regional indicators.',
  emojispeak_cannot_convert:
    'Nothing in your message could be converted. Use only letters, numbers and spaces.',
  emojispeak_too_long:
    'The message you want to convert is too long. Up to %1 characters are allowed.',
  flip_heads: "<:TRexExcited:942401501316395019> ...it's Heads!",
  flip_tails: "<:cheesewings:549758544447275022> ...it's Tails!",
  hug_no_or_self_reply:
    "You need to reply to someone else's message to hug them.",
  hug_other_user: [
    '%1 has given %2 a warm hug!',
    '%1 has given %2 a tight squeeze!',
    '%1 has given %2 an absolutely divine cuddle!',
    '%1 gave %2 the tightest hug known to man!',
    '%1 surprised %2 with a hug from behind!',
    "%2 didn't expect this... a hug from %1!",
  ],
  hug_reply_error:
    'There was an error retrieving the message being replied to. Please try again later.',
  jazz_title: 'Jazztronauts!!',
  jazz_desc:
    'Type the command followed by one of the object names below to pillage it!',
  jazz_title_daily: 'New Jazztronauts objects have spawned in!',
  jazz_desc_daily:
    'Quickly pillage them by typing the `jazz` command with an object name!',
  jazz_pillage: [
    'You pillaged the `%1`!',
    'You destroyed the `%1`!',
    'You turned the `%1` purpley-pink!',
    'You sent the `%1` into the stratosphere!',
  ],
  jazz_pillage_with_reward: [
    'You pillaged the `%1` and collected %2 %3!',
    'You destroyed the `%1` and earned %2 %3!',
    'You turned the `%1` purpley-pink and received %2 %3!',
    'You sent the `%1` into the stratosphere and got %2 %3!',
    'You converted the `%1` into %2 %3!',
  ],
  jazz_unknown_object:
    "There are none of that kind of object to pillage. Leave the command blank to see today's objects.",
  jazz_user_timeout:
    "You aren't allowed to pillage that fast! Please try again in around %1 %2.",
  jazz_no_objects:
    'There are no more objects left to pillage for today. Come back tomorrow!',
  jazz_pillage_error:
    'There was an error pillaging that object and retreiving your reward. Please try again later.',
  jazz_lb_no_users: 'No-one has pillaged an object yet.',
  jazz_lb_error:
    'There was an error fetching the Jazztronauts leaderboard. Please try again later.',
  jazz_respawn_error:
    'There was an error respawning the Jazztronauts objects. Please try again later.',
  poll_incorrect_choices:
    'If you are making a multi-choice poll, the number after the command should be between 2 and 10.',
  roll_incorrect_sides:
    'Please enter a positive integer for the number of sides, or only enter the command without parameters for a 6-sided die.',
  rps_start: "Who's up for a throw? Play either `rock`, `paper` or `scissors`.",
  rps_rock_vs_rock: '✊ Tie! Try again?',
  rps_rock_vs_paper: [
    '✊ Damn this game to blazes!',
    '✊ You low-down scoundrel...',
    '✊ Well, that sours my milk.',
  ],
  rps_rock_vs_scissors: '✊ Rock beats scissors, son!',
  rps_paper_vs_rock: '✋ Paper covers rock, boss!',
  rps_paper_vs_paper: '✋ Tie! Try again?',
  rps_paper_vs_scissors: [
    '✋ Damn this game to blazes!',
    '✋ You low-down scoundrel...',
    '✋ Well, that sours my milk.',
  ],
  rps_scissors_vs_rock: [
    '✌️ Damn this game to blazes!',
    '✌️ You low-down scoundrel...',
    '✌️ Well, that sours my milk.',
  ],
  rps_scissors_vs_paper: '✌️ Scissors cut paper, hoss!',
  rps_scissors_vs_scissors: '✌️ Tie! Try again?',
  rps_shoot: 'How could you? How... could you?',
  rps_incorrect_hand:
    'Only `rock`, `paper` and `scissors` are accepted as valid hands.',
  steamgame_incorrect_id:
    'You must provide the steamID64 of the Steam user to pick a random game from. To find it, go to https://steamid.io.',
  steamgame_running: 'Querying Steam library...',
  steamgame_unknown_id:
    'The steamID64 you provided is invalid. Please try again by copying it directly from https://steamid.io.',
  steamgame_api_error:
    'Steam failed to complete your request, please try again later.',
  steamgame_api_unset:
    'A Steam API key is required for this command to work. Please contact a server manager.',
  support_title: 'Support Centre',
  support_desc:
    "Hi there! My name is Jack5 and I'm the builder of this Discord bot. I've been using Pylon as my Discord bot for several years. Contact me if you would like to report bugs, suggest features or even check out my stuff. Cheers!",
  support_developer: 'Message Jack5',
  support_pylon: 'Pylon',
  support_pylon_link: '<https://pylon.bot>',
  tv_incorrect_arg:
    'Invalid argument. Leave blank to get a random video, or type `count` to see the total number of videos.',
  tv_incorrect_id:
    'No video exists with that index. Check `list` and try again.',
  tv_no_videos:
    'There are not yet any videos in the list. Ask a server manager to add some.',
  tv_count: 'I currently have %1 %2 available for random selection.',
  tv_list_title: 'TV Video List',
  tv_list_incorrect_page:
    'There are only %1 pages. Please enter a valid page number, or no number to view the first page.',
  tv_list_error:
    'An error occurred. Either the video IDs are malformatted or the API has been exhausted. Try again later.',
  tv_list_api_unset:
    'A YouTube API key is required for this command to work. Please contact a server manager.',
  tv_add: 'The list has been updated to include %1 more %2.',
  tv_remove: 'The list has been updated to remove %1 %2.',
  tv_incorrect_url:
    'None of the specified videos are valid. Check that they are indeed YouTube URLs.',
  tv_empty: 'Video URLs must be supplied in order to perform any action.',
  tv_db_error:
    'There was an error updating the list of videos. Please try again later.',
};
