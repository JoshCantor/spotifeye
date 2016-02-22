var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	knex = require('./db/knex.js'),
	request = require('request');

// require('dotenv').config();

require('locus');

app.use('/client', express.static(__dirname + '/../client'));

var auth = require('./routes/auth');
var user = require('./routes/user');

app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('tiny'));

app.use('/auth', auth);
app.use('/user', user);

app.listen(3000, function() {
	console.log('listening on 3000...');
});