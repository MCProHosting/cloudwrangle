var fs, log;

fs = require('fs');

if (!fs.existsSync(__dirname + '/../config/config.json')) {
  log = require('./log');
  log.error('Config file not found. You must copy config/config.example.json to cong/config.json and fill in your details!');
} else {
  module.exports = require('../config/config');
}
