var express = require("express");
var router = express.Router();
var request = require('request');
var knex = require('../db/knex');

router.get("/", function(req, res, next) {
    res.sendFile(process.cwd() + '/server/views/index.html');
});

// app.get('/dashboard', function(req, res, next) {
//     knex('songs').then(function(data){
//     	var ids = data.map(function(album) {
//     		return album.id;
//     	});
//     	console.log(ids);
//     	res.json(ids);
//     });
// });

module.exports = router;