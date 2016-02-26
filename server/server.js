var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	knex = require('./db/knex.js'),
	request = require('request'),
	path = require('path');

require('locus');



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
