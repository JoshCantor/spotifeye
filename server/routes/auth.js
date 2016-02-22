var express = require("express");
var router = express.Router();
var url = require('url');
var request = require('request');

var passport = require("passport");
var SpotifyStrategy = require('passport-spotify').Strategy;

var client_id = "1857c7c8664f4600b762dc603227be89";
var client_secret = "00d15fc31efb436ea0a012ef7af2a248";
var redirect_uri = "http://localhost:3000/auth/spotify/callback";

router.get('/spotify', function(req, res){
    var scope = 'user-read-private user-read-email playlist-read-private streaming';
    res.redirect('https://accounts.spotify.com/authorize?client_id='+client_id+'&client_secret='+client_secret+'&redirect_uri='+redirect_uri+'&scope='+scope+'&response_type=code'+'&show_dialog=true')
})

router.get('/spotify/callback', function(req,res){
    var code = req.query.code;
    request.post({
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code:code,
            redirect_uri: 'http://localhost:3000/auth/spotify/callback',
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        }
    }, function(error, response, body){
        var access_token = body.access_token;
    })
})

module.exports = {
	router:router,
	passport:passport
}