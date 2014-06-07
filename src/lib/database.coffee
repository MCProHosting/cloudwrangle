config  = require('./config')
fs      = require('fs')
log     = require('./log')
sqlite  = require('sqlite3')
async   = require('async')

if config.file_db
    path = __dirname + '/../../storage/db.sqlite'
    initialized = fs.existsSync path
else
    path = ':memory:'
    initalized = false

db = null

initalize =  ->
    if not initialized
        async.series [(cb) ->
            db.run '''
                CREATE TABLE `domains` (
                    `name` varchar(20),
                    `status` varchar(10),
                    `stats` text,
                    PRIMARY KEY (`name`)
                );
            ''', cb
        , (cb) ->
            db.run '''
                    CREATE TABLE `records` (
                        `id` int(11),
                        `domain` varchar(20),
                        `name` varchar(100),
                        `content` varchar(100),
                        `data` text,
                        PRIMARY KEY (`id`)
                    );
                ''', cb
        ], -> db.ready()
    else
        db.ready()

db = new sqlite.Database path, initalize
db.ready = ->

module.exports = db