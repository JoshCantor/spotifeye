var express = require("express");
var router = express.Router();
var request = require('request');


var knex = require('../db/knex')

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
        var bodyJSON = JSON.parse(body);
        var access_token = bodyJSON.access_token;
        var refresh_token = bodyJSON.refresh_token;

        request.get('https://api.spotify.com/v1/me?access_token='+access_token,function(error,response,body){
            var userInfoJSON = JSON.parse(body);

            var user_id = userInfoJSON.id;
            var display_name = userInfoJSON.display_name;
            var profile_pic = userInfoJSON.images[0].url;

            // knex('users').where({user_id:user_id}).then(function(data){
            //     if(data.length === 0){
            //         console.log("first and only time adding this user")
            //         knex('users').insert({display_name:display_name,
            //                              user_id:user_id,
            //                              profile_pic:profile_pic
            //                             }).then(function(test){
            //                                 request.get('https://api.spotify.com/v1/users/'+user_id+'/playlists?access_token='+access_token, function(error, response, body){
            //                                     var playlistJSON = JSON.parse(body);
            //                                 })
            //                             })
            //     }
            // })
        })
    })
})

module.exports = {
	router:router
}