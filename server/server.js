var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	knex = require('../db/knex');
	
require('dotenv').config();
require('locus');

app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('tiny'));


app.listen(3000, function() {
	console.log('listening on 3000...');
});