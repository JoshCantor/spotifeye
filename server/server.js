var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var knex = require('./db/knex.js');
var request = require('request');
var path = require('path');
var Curl = require('node-libcurl').Curl;

// require('dotenv').config();
require('locus');



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



app.listen(3000, function() {
    console.log('listening on 3000...');
});

module.exports = app;
