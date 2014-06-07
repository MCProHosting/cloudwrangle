log      = require('./lib/log')
config   = require('./lib/config')
database = require('./lib/database')

database.ready = ->
    app = require('./lib/express')
    app.listen config.server.port, config.server.host

    log.info "Booted server on #{config.server.host}:#{config.server.port}"