database   = require('../../../lib/database')
log        = require('../../../lib/log')

insert = database.prepare '''
    insert into `records`
    (`id`, `domain`, `name`, `content`, `data`)
    values
    ($id, $domain, $name, $content, $data)
'''


module.exports =
    insert: (record, callback) ->
        insert.run {
            $id:      record.rec_id
            $domain:  record.zone_name
            $name:    record.name
            $content: record.content
            $data:    JSON.stringify(record)
        }, callback

    delete: (id, callback) ->
        database.run 'delete from `records` where `id` = ?', id, callback