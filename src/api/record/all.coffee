check    = require('./lib/check-domain')
database = require('../../lib/database')
config   = require('../../lib/config')
log      = require('../../lib/log')

module.exports = (req, res) ->
    check req, res, (data) ->
        if data.domain.status is 'notfound'
            return res.json data

        limits = []
        limits[0] = if req.query?.page? then config.page_length * parseInt(req.query.page) else 0
        limits[1] = limits[0] + config.page_length

        params = {$domain: req.params.domain}

        query = 'select `id`, `name`, `content` from `records` where `domain` = $domain'

        if req.query?.q?
            query += ' and (`name` LIKE $query OR `content` LIKE $query)'
            params.$query = "%#{req.query.q}%"

        query += " limit #{limits[0]}, #{limits[1]}"

        database.all query, params, (err, rows) ->
            if err
                return log.error 'DB: Error on record query: ' + err

            data.results = rows

            res.json data