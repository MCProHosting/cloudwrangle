cloudflare = require('../../lib/cloudflare')
log        = require('../../lib/log')
ops        = require('./lib/db-ops')

module.exports = (req, res) ->

    cloudflare.addDomainRecord req.params.domain, req.body, (err, rec) ->
        if err
            log.error 'Cloudflare: Error on record delete: ' + err

        res.send 200

        ops.insert rec, (err) ->
            if err
                log.error 'DB: Error on record insert: ' + err