var express = require('express');
var router = express.Router();
var request = require('request');
var knex = require('../db/knex');

var bubblesData = require('../../dataParser.js');
// var timeData = require('../../time.csv');


router.get('/user', function(req, res, next) {
    // res.sendFile(process.cwd() + '/server/views/index.html');
    /** mau5 - temp test of sending new landing/index.html with loginbutton */
    res.sendFile(process.cwd() + '/server/views/index.html');
});

router.get('/dashboard/:d3view', function(req, res, next) {
	// console.log(req.params.d3view);
	if (req.params.d3view === 'time') {
		// res.send(timeData);
		// console.log(process.cwd());
		// console.log(__dirname);
		res.sendFile(process.cwd() + '/time.csv');
	} 
	if (req.params.d3view === 'bubbles') {
		res.send(bubblesData);	
	}
});


router.get('/:id/info', function(req, res, next){ //SENDS USER JSON DATA
	var user_id = req.params.id;
	knex('users').where({user_id:user_id}).then(function(data){
		res.send(data)
	})
})

router.get('/:id/albumart', function(req, res, next){
	var user_id = req.params.id;
	var album_art_arr = [];
	knex('savedtracks').where({user_id:user_id}).then(function(data){
		var trackPromises = [];
		for(var i=0; i < data.length; i++){
			var currentTrack = data[i].track_id;
			var tp = knex('tracks').where({track_id:currentTrack});
			trackPromises.push(tp);
		}

		Promise.all(trackPromises).then(function(listOfTrackResponses) {
			res.send(listOfTrackResponses)
		});
	})
	
})


module.exports = router;
