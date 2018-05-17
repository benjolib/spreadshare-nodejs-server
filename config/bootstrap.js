"use strict";

const DBMigrate = require("db-migrate");

module.exports = function(app) {
  app.services.PassportService.init();

  // run all migrations
  let dbm = DBMigrate.getInstance(true);
  //console.log('dbm.config',dbm.config)
  dbm.up(err => {
    if (err) throw err;
    // else
    //   console.log(`all migrations run successfully.`)
  });
};
