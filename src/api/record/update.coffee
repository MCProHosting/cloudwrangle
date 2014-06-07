ops        = require('./lib/db-ops')
cloudflare = require('../../lib/cloudflare')
log        = require('../../lib/log')

module.exports = (req, res) ->

    ops.delete req.params.id, ->

    cloudflare.editDomainRecord req.params.domain, req.params.id, req.body, (err, rec) ->
        if err
            log.error 'Cloudflare: Error on record delete: ' + err

        res.send 200

        ops.insert rec.obj, (err) ->
            if err
                log.error 'DB: Error on record edit: ' + err