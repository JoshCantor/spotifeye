var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	knex = require('./db/knex.js'),
	request = require('request'),
    passport = require('passport')

// require('dotenv').config();
require('locus');
//test
var auth = require('./routes/auth');


app.use('/client', express.static(__dirname + '/../client'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('tiny'));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth',auth.router)

app.get("/", function(req, res, next) {
    res.sendFile(__dirname + '/views/index.html');
});


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

// app.get('/dashboard', function(req, res, next) {
//     knex('songs').then(function(data){
//     	var ids = data.map(function(album) {
//     		return album.id;
//     	});
//     	console.log(ids);
//     	res.json(ids);
//     });
// });



app.listen(3000, function() {
	console.log('listening on 3000...');
});