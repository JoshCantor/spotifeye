var express = require('express');
var router = express.Router();
var request = require('request');
var knex = require('../db/knex');

var d3data = require('../../dataParser.js')

router.get('/user', function(req, res, next) {
    // res.sendFile(process.cwd() + '/server/views/index.html');
    /** mau5 - temp test of sending new landing/index.html with loginbutton */
    res.sendFile(process.cwd() + '/server/views/index.html');
});

router.get('/dashboard/bubbles', function(req, res, next) {
	res.send(d3data)
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
