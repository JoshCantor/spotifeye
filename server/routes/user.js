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

module.exports = router;
