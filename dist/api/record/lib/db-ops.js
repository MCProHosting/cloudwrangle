var database, insert, log;

database = require('../../../lib/database');

log = require('../../../lib/log');

insert = database.prepare('insert or ignore into `records`\n(`id`, `domain`, `name`, `content`, `type`, `data`)\nvalues\n($id, $domain, $name, $content, $type, $data)');

module.exports = {
  insert: function(record, callback) {
    return insert.run({
      $id: record.rec_id,
      $domain: record.zone_name,
      $name: record.name,
      $type: record.type,
      $content: record.content,
      $data: JSON.stringify(record)
    }, callback);
  },
  "delete": function(id, callback) {
    return database.run('delete from `records` where `id` = ?', id, callback);
  }
};
