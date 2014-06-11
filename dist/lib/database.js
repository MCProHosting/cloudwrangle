var async, config, db, fs, initalize, initalized, initialized, log, path, sqlite;

config = require('./config');

fs = require('fs');

log = require('./log');

sqlite = require('sqlite3');

async = require('async');

if (config.file_db) {
  path = __dirname + '/../../storage/db.sqlite';
  initialized = fs.existsSync(path);
} else {
  path = ':memory:';
  initalized = false;
}

db = null;

initalize = function() {
  if (!initialized) {
    return async.series([
      function(cb) {
        return db.run('CREATE TABLE `domains` (\n    `name` varchar(20),\n    `status` varchar(10),\n    `stats` text,\n    PRIMARY KEY (`name`)\n);', cb);
      }, function(cb) {
        return db.run('CREATE TABLE `records` (\n    `id` int(11),\n    `domain` varchar(20),\n    `name` varchar(100),\n    `content` varchar(100),\n    `type` varchar(10),\n    `data` text,\n    PRIMARY KEY (`id`)\n);', cb);
      }
    ], db.ready);
  } else {
    return db.ready();
  }
};

db = new sqlite.Database(path, initalize);

db.ready = function() {};

module.exports = db;
