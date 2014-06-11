var cloudflare, config;

cloudflare = require('cloudflare');

config = require('./config');

module.exports = cloudflare.createClient(config.cloudflare);
