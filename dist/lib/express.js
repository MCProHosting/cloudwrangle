var app, express, log;

express = require('express');

log = require('./log');

app = express();

app.use(require('body-parser')());

app.use(express["static"](__dirname + '/public'));

app.engine('.html', require('ejs').renderFile);

app.set('views', __dirname + '/../views');

app.use(express["static"](__dirname + '/../public'));

app.get('/', function(req, res) {
  return res.render('index.html');
});

app.get('/api/:domain/record', require('../api/record/all'));

app.put('/api/:domain/record', require('../api/record/create'));

app.get('/api/:domain/record/:id', require('../api/record/find'));

app["delete"]('/api/:domain/record/:id', require('../api/record/delete'));

app.post('/api/:domain/record/:id', require('../api/record/update'));

module.exports = app;
