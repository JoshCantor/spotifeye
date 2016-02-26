var express = require('express');
var router = express.Router();
var request = require('request');
require('dotenv').load();

var knex = require('../db/knex');

var redirect_uri = "http://www.spotifeye.com/auth/spotify/callback";

router.get('/spotify', function(req, res){
    var scope = 'user-read-private user-read-email playlist-read-private streaming user-library-read';
    res.redirect('https://accounts.spotify.com/authorize?client_id='+process.env.client_id+'&client_secret='+process.env.client_secret+'&redirect_uri='+redirect_uri+'&scope='+scope+'&response_type=code'+'&show_dialog=true')
});

router.get('/spotify/callback', function(req, res) {
    var code = req.query.code;
    request.post({
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: 'http://www.spotifeye.com/auth/spotify/callback',
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(process.env.client_id + ':' + process.env.client_secret).toString('base64'))
        }
    }, function(error, response, body) {
        var bodyJSON = JSON.parse(body);
        var access_token = bodyJSON.access_token;
        var refresh_token = bodyJSON.refresh_token;

        request.get('https://api.spotify.com/v1/me?access_token=' + access_token, function(error, response, body) {

            var userInfoJSON = JSON.parse(body);

            var user_id = userInfoJSON.id;
            var display_name = userInfoJSON.display_name;
            var profile_pic = userInfoJSON.images[0].url;

            knex('users').where({ user_id: user_id }).then(function(data){
                if(data.length === 0){
                    knex('users').insert({ display_name: display_name, user_id: user_id, profile_pic:profile_pic })
                    .then(function(){ // INSERTS SONGS IF FIRST TIME LOGINING IN
                        // request.get('https://api.spotify.com/v1/me/tracks?limit=50&access_token='+access_token, function(error, response,body){
                        //     addTracksToDB(body,user_id)
                        // })
                        var items = [];
                        getNext('https://api.spotify.com/v1/me/tracks?limit=50&access_token=', access_token, items, user_id);
                        res.redirect('/#/dashboard/user/'+user_id);
                        // res.redirect('/user/'+user_id+'/albumart')
                    });
                }
                else {
                    // request.get('https://api.spotify.com/v1/me/tracks?limit=50&access_token='+access_token, function(error, response,body){
                    //     addTracksToDB(body,user_id);
                    // })
                    var items = [];
                    getNext('https://api.spotify.com/v1/me/tracks?limit=50&access_token=', access_token, items, user_id);
                    res.redirect('/#/dashboard/user/'+user_id);
                    // res.redirect('/user/'+user_id+'/albumart')
                }
            });
        });
    });
});

function getNext(next, access_token, items, user_id) {
    request.get(next + access_token, function(error, response, body) {
        var parsed = JSON.parse(body);
        items = items.concat(parsed.items);
        if (parsed.next) {
            getNext(parsed.next + '&access_token=', access_token, items, user_id);
        } else {
            addTracksToDB(items, user_id);
        }
    });
}

function addTracksToDB(items, user_id) {
    for(var i = 0; i < items.length; i++){
        var track_id = items[i].track.id;
        var track_name = items[i].track.name;
        var track_popularity = items[i].track.popularity;
        var track_art = items[i].track.album.images[0].url;
        var preview_url = items[i].track.preview_url;
        var explicit = items[i].track.explicit;
        var duration_ms = items[i].track.duration_ms;
        var added_at = items[i].added_at;

        knex('tracks').where({track_id:track_id})
        .then(generateInsertCB(track_id, track_name, track_popularity, track_art, preview_url, explicit, duration_ms, user_id, added_at));
    }
}

function generateInsertCB(track_id, track_name, track_popularity, track_art, preview_url, explicit, duration_ms, user_id, added_at){
    knex('tracks').where({track_id:track_id}).then(function(data){
        if(data.length === 0){
            knex('tracks')
            .insert({
                track_id:track_id,
                track_name:track_name,
                track_popularity:track_popularity,
                album_art:track_art,
                preview_url:preview_url,
                explicit:explicit,
                duration_ms:duration_ms
            })
            .then(function(){})
        }
    });
    knex('savedtracks').where({user_id:user_id,track_id:track_id}).then(function(rows){
        if(rows.length === 0){
            knex('savedtracks').insert({user_id:user_id,track_id:track_id,added_at:added_at}).then(function(){
                console.log(added_at);
            });
        }
    });
    
}

module.exports = router;

