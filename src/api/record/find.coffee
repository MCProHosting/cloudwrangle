database = require('../../lib/database')
log      = require('../../lib/log')

module.exports = (req, res) ->
    database.get 'select * from `records` where `id` = ?', req.params.id, (err, row) ->
        if err
            log.error 'DB: Error on record lookup: ' + err

        if not row
            return res.send 404

        row.data = JSON.parse row.data

        return res.json row