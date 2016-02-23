var express = require('express');
var router = express.Router();
var request = require('request');
var knex = require('../db/knex');

router.get('/user', function(req, res, next) {
    // res.sendFile(process.cwd() + '/server/views/index.html');
    /** mau5 - temp test of sending new landing/index.html with loginbutton */
    res.sendFile(process.cwd() + '/server/views/index.html');
});

router.get('/bubble', function(req, res, next) {
    knex('songs').then(function(data) {
        console.log(data);
        res.json(data);
    });
});

module.exports = router;
