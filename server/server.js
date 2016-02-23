var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var knex = require('./db/knex.js');
var request = require('request');
require('locus');

var auth = require('./routes/auth');
var user = require('./routes/user');
// mau - landingpage route
var home = require('./routes/home');

var app = express();
// require('dotenv').config();

app.use('/client', express.static(__dirname + '../client'));
// mau - route to public

app.use(express.static(path.join(__dirname, "../client/public")));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('tiny'));

app.use('/', home);
app.use('/auth', auth);
app.use('/user', user);

app.listen(3000, function() {
    console.log('listening on 3000...');
});

module.exports = app;
