var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	knex = require('./db/knex.js'),
	request = require('request'),
    passport = require('passport');


// require('dotenv').config();
//test
var auth = require('./routes/auth');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('tiny'));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth',auth);

// app.get("/", function(req, res, next) {
// 	request.get("https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy", function(error, response, body) {
//         if (error) {
//             res.status(500).send("You got an error - " + error);
//         } else if (!error && response.statCode >= 300) {
//             res.status(500).send("Something went wrong! Status: " + response.statusCode);
//         }
//         if (!error && response.statusCode === 200) {
//             var data = JSON.parse(body);
//             knex('songs').insert({json_data: data}).returning('json_data')
//             .then(function(json) {
//             	console.log('json', json);
//             });
//         }
//     });
// });

app.listen(3000, function() {
	console.log('listening on 3000...');
});