var async, cloudflare, database, loadDomainInfo, loadRecords, log, ops, startLoading;

async = require('async');

database = require('../../../lib/database');

cloudflare = require('../../../lib/cloudflare');

log = require('../../../lib/log');

ops = require('./db-ops');

loadDomainInfo = function(domain, callback) {
  return cloudflare.domainStats(domain, 30, function(err, res) {
    if (err) {
      return log.error('Cloudflare: API error getting stats: ' + err);
    }
    if (res.result.objs.length === 0) {
      database.run('insert into domains\n(name, status, stats)\nvalues\n(?, "notfound", "{}")', domain);
      return log.warning("Attempted to look up records for domain " + domain + " but found nothing");
    }
    return database.run('insert into domains\n(name, status, stats)\nvalues\n(?, "loading", ?)', domain, JSON.stringify(res.result.objs[0]), function() {
      return callback(domain, this.lastID);
    });
  });
};

loadRecords = function(domain, offset) {
  if (offset == null) {
    offset = 0;
  }
  return cloudflare._request('rec_load_all', {
    z: domain,
    o: offset
  }, function(err, res) {
    if (err) {
      return log.error('Cloudflare: API error getting records: ' + err);
    }
    return async.eachLimit(res.recs.objs, 4, ops.insert, function(err) {
      if (err) {
        return log.error('DB: Error while inserting records: ' + err);
      }
      if (res.recs.has_more) {
        return loadRecords(domain, offset + res.recs.count);
      } else {
        return database.run('update domains set `status` = "complete" where `name` = ?', domain);
      }
    });
  });
};

startLoading = function(domain) {
  return loadDomainInfo(domain, loadRecords);
};

module.exports = function(req, res, next) {
  return database.get('select * from `domains` where `name` = ?', req.params.domain, function(err, row) {
    var data;
    if (err) {
      log.error('DB: SQL error: ' + err);
    }
    data = {};
    if (row) {
      data.domain = {
        loaded: true,
        status: row.status,
        info: JSON.parse(row.stats)
      };
    } else {
      data.domain = {
        loaded: false,
        status: 'loading',
        info: {}
      };
      startLoading(req.params.domain);
    }
    return next(data);
  });
};
