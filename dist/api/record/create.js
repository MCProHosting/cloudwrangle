var cloudflare, log, ops;

cloudflare = require('../../lib/cloudflare');

log = require('../../lib/log');

ops = require('./lib/db-ops');

module.exports = function(req, res) {
  return cloudflare.addDomainRecord(req.params.domain, req.body, function(err, rec) {
    if (err) {
      log.error('Cloudflare: Error on record delete: ' + err);
    }
    res.send(200);
    return ops.insert(rec, function(err) {
      if (err) {
        return log.error('DB: Error on record insert: ' + err);
      }
    });
  });
};
