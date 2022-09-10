/* This file loads all top-level commands and functions that need to be active for the bot to work.
 * Add new commands here when they should be recognised by the bot.
 */

import './lang';

import './commands/8ball';
import './commands/avatar';
import './commands/dadjoke';
import './commands/emojispeak';
import './commands/flip';
import './commands/help';
import './commands/hug';
import './commands/jazz';
import './commands/links';
import './commands/medic';
import './commands/poll';
import './commands/roll';
import './commands/rps';
import './commands/steamgame';
import './commands/support';
import './commands/tv';

import './scheduled';
import './logging';

// Initialise database by deleting user timeouts.
let database1 = new pylon.KVNamespace('timeout');
database1.delete('timedOut');
let database2 = new pylon.KVNamespace('jazz');
database2.delete('timedOut');
