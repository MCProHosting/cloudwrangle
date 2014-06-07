ops        = require('./lib/db-ops')
cloudflare = require('../../lib/cloudflare')
log        = require('../../lib/log')

module.exports = (req, res) ->

    cloudflare.deleteDomainRecord req.params.domain, req.params.id, (err) ->
        if err
            log.error 'Cloudflare: Error on record delete: ' + err

        res.send 200

    ops.delete req.params.id, (err) ->
        if err
            log.error 'DB: Error on record delete: ' + err