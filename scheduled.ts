/* This file contains tasks that are scheduled, so Pylon can run them automatically at a specified time.
 * Pylon is limited to 5 schedules at once. It may be necessary to combine schedules as more commands are created.
 * Functions need to be exported to be run from here.
 */

import { deleteExpiredHangmans } from './commands/hangman';
import { spawnJazzObjects, showJazzObjects } from './commands/jazz';
import { deleteExpiredStandoffs } from './commands/standoff';
import { tvShowRandomVideo } from './commands/tv';

// Run every hour
pylon.tasks.cron('delete_expired_games', '0 0 * * * *', async () => {
  deleteExpiredHangmans();
  deleteExpiredStandoffs();
});

// Run every day at 00:00 UTC (10:00 AEST)
pylon.tasks.cron('jazz_and_tv', '0 0 0 * * * *', async () => {
  // Spawn Jazztronauts objects
  spawnJazzObjects()
    .then(() => {
      showJazzObjects(null, true);
    })
    .catch(() => {}); // Do not do anything if the error is thrown for now.
  // Show random video from TV
  tvShowRandomVideo(null, null);
});
