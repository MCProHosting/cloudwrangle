var cloudflare, log, ops;

ops = require('./lib/db-ops');

cloudflare = require('../../lib/cloudflare');

log = require('../../lib/log');

module.exports = function(req, res) {
  ops["delete"](req.params.id, function() {});
  return cloudflare.editDomainRecord(req.params.domain, req.params.id, req.body, function(err, rec) {
    if (err) {
      log.error('Cloudflare: Error on record delete: ' + err);
    }
    res.send(200);
    return ops.insert(rec.rec.obj, function(err) {
      if (err) {
        return log.error('DB: Error on record edit: ' + err);
      }
    });
  });
};
