var database, log;

database = require('../../lib/database');

log = require('../../lib/log');

module.exports = function(req, res) {
  return database.get('select * from `records` where `id` = ?', req.params.id, function(err, row) {
    if (err) {
      log.error('DB: Error on record lookup: ' + err);
    }
    if (!row) {
      return res.send(404);
    }
    row.data = JSON.parse(row.data);
    return res.json(row);
  });
};
