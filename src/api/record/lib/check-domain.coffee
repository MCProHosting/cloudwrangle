async      = require('async')
database   = require('../../../lib/database')
cloudflare = require('../../../lib/cloudflare')
log        = require('../../../lib/log')
ops        = require('./db-ops')

loadDomainInfo = (domain, callback) ->
    cloudflare.domainStats domain, 30, (err, res) ->
        if err
            return log.error 'Cloudflare: API error getting stats: ' + err

        if res.result.objs.length is 0
            database.run '''
                insert into domains
                (name, status, stats)
                values
                (?, "notfound", "{}")
            ''', domain

            return log.warning "Attempted to look up records for domain #{domain} but found nothing"

        database.run '''
            insert into domains
            (name, status, stats)
            values
            (?, "loading", ?)
        ''', domain, JSON.stringify(res.result.objs[0]), -> callback domain, @lastID

loadRecords = (domain, offset = 0) ->
    cloudflare._request 'rec_load_all', {z: domain, o: offset}, (err, res) ->
        if err
            return log.error 'Cloudflare: API error getting records: ' + err

        async.eachLimit res.recs.objs, 4, ops.insert, (err) ->
            if err
                return log.error 'DB: Error while inserting records: ' + err

            if res.recs.has_more
                loadRecords domain, offset + res.recs.count
            else
                database.run 'update domains set `status` = "complete" where `name` = ?', domain


startLoading = (domain) ->
    loadDomainInfo domain, loadRecords

module.exports = (req, res, next) ->

    database.get 'select * from `domains` where `name` = ?', req.params.domain, (err, row) ->
        if err
            log.error 'DB: SQL error: ' + err

        data = {}

        if row
            data.domain =
                loaded: true
                status: row.status
                info: JSON.parse(row.stats)
        else
            data.domain =
                loaded: false,
                status: 'loading'
                info: {}

            startLoading req.params.domain

        next data