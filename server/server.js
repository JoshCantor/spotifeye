var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	knex = require('./db/knex.js'),
	request = require('request');

// require('dotenv').config();
require('locus');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('tiny'));

app.get("/", function(req, res, next) {
	request.get("https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy", function(error, response, body) {
        if (error) {
            res.status(500).send("You got an error - " + error);
        } else if (!error && response.statCode >= 300) {
            res.status(500).send("Something went wrong! Status: " + response.statusCode);
        }
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            knex('songs').insert({json_data: data}).returning('json_data')
            .then(function(json) {
            	console.log('json', json);
            });
        }
    });
});

app.get('/dashboard', function(req, res, next) {
    res.render('/views/index');
});


app.listen(3000, function() {
	console.log('listening on 3000...');
});