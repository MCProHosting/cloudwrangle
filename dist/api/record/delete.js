var cloudflare, log, ops;

ops = require('./lib/db-ops');

cloudflare = require('../../lib/cloudflare');

log = require('../../lib/log');

module.exports = function(req, res) {
  cloudflare.deleteDomainRecord(req.params.domain, req.params.id, function(err) {
    if (err) {
      log.error('Cloudflare: Error on record delete: ' + err);
    }
    return res.send(200);
  });
  return ops["delete"](req.params.id, function(err) {
    if (err) {
      return log.error('DB: Error on record delete: ' + err);
    }
  });
};
