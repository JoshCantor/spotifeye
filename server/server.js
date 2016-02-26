var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	knex = require('./db/knex.js'),
	request = require('request'),
	path = require('path'),
	pg = require('pg');

// require('dotenv').config();
require('locus');

pg.connect(process.env.DATABASE_URL + '?ssl=true', function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});


// require('dotenv').config();
//test

var auth = require('./routes/auth');
var user = require('./routes/user');
// mau - landingpage route
var home = require('./routes/home');

app.use('/', express.static(path.join(__dirname, "../client/public")));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('tiny'));


app.use('/auth', auth);
app.use('/user', user);
app.use('/', home);




app.listen(process.env.PORT, function() {
    console.log('listening on 5000...');
});

module.exports = app;
