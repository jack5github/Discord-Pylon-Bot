/* This file contains tasks that are scheduled, so Pylon can run them automatically at a specified time.
 * Pylon is limited to 5 schedules at once. It may be necessary to combine schedules as more commands are created.
 * Functions need to be exported to be run from here.
 */

import { spawnJazzObjects, showJazzObjects } from './commands/jazz';

// Run every day at 00:00 UTC (10:00 AEST)
pylon.tasks.cron('spawn_jazz_objects', '0 0 0 * * * *', async () => {
  spawnJazzObjects()
    .then(() => {
      showJazzObjects(null, true);
    })
    .catch(() => {}); // Do not do anything if the error is thrown for now.
});
