/* This file contains important functions used by bot commands that deal with the bot's economy.
 * This mainly includes storing and updating the amount of currency a user has.
 */

export async function getUserCurrency(userId: string) {
  let database = new pylon.KVNamespace('economy');
  let balance = 0;
  let success = true;
  await database
    .get<any[]>('balance')
    .then((users) => {
      if (users != null) {
        let userSearch = (element: any) => element.id == userId;
        let user = users.find(userSearch);
        if (user != null) {
          // The user's listing was found, return the amount.
          balance = user.amount;
        }
      }
      // The user's listing was not found, assume they have no currency.
      return 0;
    })
    .catch(() => {
      success = false;
    });
  if (success) {
    return balance; // If the user's listing was not found, it is assumed they have no currency.
  }
  return -1; // There was an error with the database, report this error.
}

export async function addUserCurrency(userId: string, currency: number) {
  let database = new pylon.KVNamespace('economy');
  let success = true;
  if (currency >= 0) {
    await database
      .get<any[]>('balance')
      .then(async (users) => {
        if (users != null) {
          let userSearch = (element: any) => element.id == userId;
          let index = users.findIndex(userSearch);
          if (index != -1) {
            // The user's listing was found, update the amount.
            users[index].amount += currency;
          } else {
            // The user's listing was not found, add a new listing.
            users.push({
              id: userId,
              amount: currency,
            });
          }
        } else {
          // The database has not been initialised, create it with a new listing.
          users = [
            {
              id: userId,
              amount: currency,
            },
          ];
        }
        // Update the database with the new status of every user's currency.
        await database.put('balance', users).catch(() => {
          success = false;
        });
      })
      .catch(() => {
        success = false;
      });
  } else {
    // Cannot add negative amount.
    success = false;
  }
  if (success) {
    return 1;
  }
  return -1; // There was an error with the database, report this error.
}

export async function subtractUserCurrency(userId: string, currency: number) {
  let database = new pylon.KVNamespace('economy');
  let success = true;
  let poor = false;
  if (currency >= 0) {
    await database.get<any[]>('balance').then(async (users) => {
      if (users != null) {
        let userSearch = (element: any) => element.id == userId;
        let index = users.findIndex(userSearch);
        if (index != -1) {
          // The user's listing was found, check if the amount can be subtracted.
          if (users[index].amount >= currency) {
            users[index].amount -= currency;
            await database.put('balance', users).catch(() => {
              // There was an error with the database, report this error.
              success = false;
            });
          } else {
            // The user cannot pay the amount specified.
            poor = true;
          }
        } else {
          // The user's listing was not found.
          poor = true;
        }
      } else {
        // The database has not been initialised.
        poor = true;
      }
    });
  }
  if (poor) {
    return 0;
  } else if (success) {
    return 1;
  }
  // There was an error with the database or the amount, report this error.
  return -1;
}

export async function setUserCurrency(userId: string, currency: number) {
  let database = new pylon.KVNamespace('economy');
  let success = true;
  if (currency >= 0) {
    await database
      .get<any[]>('balance')
      .then(async (users) => {
        if (users != null) {
          let userSearch = (element: any) => element.id == userId;
          let index = users.findIndex(userSearch);
          if (index != -1) {
            // The user's listing was found, set the amount.
            users[index].amount = currency;
          } else {
            // The user's listing was not found, add a new listing.
            users.push({
              id: userId,
              amount: currency,
            });
          }
        } else {
          // The database has not been initialised, create it with a new listing.
          users = [
            {
              id: userId,
              amount: currency,
            },
          ];
        }
        // Update the database with the new status of every user's currency
        await database.put('balance', users).catch(() => {
          success = false;
        });
      })
      .catch(() => {
        success = false;
      });
  } else {
    // Cannot set to a negative amount.
    success = false;
  }
  if (success) {
    return 1;
  }
  return -1; // There was an error with the database, report this error.
}
