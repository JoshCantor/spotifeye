var express = require("express");
var router = express.Router();
var request = require('request');


var knex = require('../db/knex')

var client_id = "1857c7c8664f4600b762dc603227be89";
var client_secret = "00d15fc31efb436ea0a012ef7af2a248";
var redirect_uri = "http://localhost:3000/auth/spotify/callback";

router.get('/spotify', function(req, res){
    var scope = 'user-read-private user-read-email playlist-read-private streaming user-library-read';
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

            knex('users').where({user_id:user_id}).then(function(data){
                if(data.length === 0){
                    knex('users').insert({display_name:display_name,
                                         user_id:user_id,
                                         profile_pic:profile_pic
                                        }).then(function(test){
                                            request.get('https://api.spotify.com/v1/me/tracks?access_token='+access_token, function(error, response,body){
                                                var responseJSON = JSON.parse(body);
                                                for(var i = 0; i < responseJSON.items.length; i++){
                                                    var track_id = responseJSON.items[i].track.id;
                                                    var track_name = responseJSON.items[i].track.name;
                                                    var track_popularity = responseJSON.items[i].track.popularity;
                                                    var track_art = responseJSON.items[i].track.album.images[0].url;
                                                    var preview_url = responseJSON.items[i].track.preview_url;
                                                    function generateInsertCB(track_id,track_name,track_popularity,track_art, preview_url){
                                                        knex('tracks').insert({track_id:track_id,
                                                                               track_name:track_name,
                                                                               track_popularity:track_popularity,
                                                                               album_art:track_art,
                                                                               preview_url:preview_url}).then(function(){})
                                                    }
                                                    knex('tracks').where({track_id:track_id}).then(generateInsertCB(track_id,track_name,track_popularity,track_art, preview_url))
                                                }
                                            })
                                        })
                }
                else{
                    request.get('https://api.spotify.com/v1/me/tracks?access_token='+access_token, function(error, response,body){
                        var responseJSON = JSON.parse(body);
                        for(var i = 0; i < responseJSON.items.length; i++){
                            var track_id = responseJSON.items[i].track.id;
                            var track_name = responseJSON.items[i].track.name;
                            var track_popularity = responseJSON.items[i].track.popularity;
                            var track_art = responseJSON.items[i].track.album.images[0].url;
                            var preview_url = responseJSON.items[i].track.preview_url;
                            function generateInsertCB(track_id,track_name,track_popularity,track_art, preview_url){
                                knex('tracks').insert({track_id:track_id,
                                                       track_name:track_name,
                                                       track_popularity:track_popularity,
                                                       album_art:track_art,
                                                       preview_url:preview_url}).then(function(){})
                            }
                            knex('tracks').where({track_id:track_id}).then(generateInsertCB(track_id,track_name,track_popularity,track_art, preview_url))
                        }
                    })
                }
            })
        })
    })
})

module.exports = {
	router:router
}