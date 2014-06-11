var async, check, config, database, log;

check = require('./lib/check-domain');

database = require('../../lib/database');

config = require('../../lib/config');

log = require('../../lib/log');

async = require('async');

module.exports = function(req, res) {
  return check(req, res, function(data) {
    var limits, params, query, _ref, _ref1;
    if (data.domain.status === 'notfound') {
      return res.json(data);
    }
    limits = [];
    limits[0] = ((_ref = req.query) != null ? _ref.page : void 0) != null ? config.page_length * parseInt(req.query.page) : 0;
    limits[1] = limits[0] + config.page_length;
    params = {
      $domain: req.params.domain
    };
    query = ' where `domain` = $domain';
    if (((_ref1 = req.query) != null ? _ref1.q : void 0) != null) {
      query += ' and (`name` LIKE $query OR `content` LIKE $query)';
      params.$query = "%" + req.query.q + "%";
    }
    query += " limit " + limits[0] + ", " + limits[1];
    return async.parallel([
      function(callback) {
        return database.get('select COUNT(*) as count from `records`' + query, params, function(err, rows) {
          if (err) {
            return log.error('DB: Error on record query: ' + err);
          }
          data.pages = Math.ceil(rows.count / config.page_length);
          data.hasNext = limits[1] < rows.count;
          data.hasPrev = limits[0] > 0;
          return callback();
        });
      }, function(callback) {
        return database.all('select `id`, `name`, `content`, `type` from `records`' + query, params, function(err, rows) {
          if (err) {
            return log.error('DB: Error on record query: ' + err);
          }
          data.results = rows;
          return callback();
        });
      }
    ], function() {
      return res.json(data);
    });
  });
};
