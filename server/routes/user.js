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


router.get('/:id/dashboard', function(req, res, next){ //SENDS USER JSON DATA
	var user_id = req.params.id;
	knex('users').where({user_id:user_id}).then(function(data){
		res.send(data)
	})
})


module.exports = router;
