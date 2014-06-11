var config, database, log;

log = require('./lib/log');

config = require('./lib/config');

database = require('./lib/database');

database.ready = function() {
  var app;
  app = require('./lib/express');
  app.listen(config.server.port, config.server.host);
  return log.info("Booted server on " + config.server.host + ":" + config.server.port);
};
