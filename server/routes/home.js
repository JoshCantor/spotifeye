var express = require('express');
var router = express.Router();
var request = require('request');
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
    // res.sendFile(process.cwd() + '/server/views/index.html');
    /** mau5 - temp test of sending new landing/index.html with loginbutton */
    res.sendFile(process.cwd() + '/server/views/index.html');
});

module.exports = router;
