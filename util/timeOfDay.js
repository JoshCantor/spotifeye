var knex = require('../server/db/knex');
var fs = require('fs');
// var request = require('request');
// require('dotenv').load();

knex.select('track_id','added_at').from('savedtracks').then(function(data){
    // console.log(data);
    var cleanedData = {};
    for (var i = 0; i < data.length; i++) {
        var added_full = new Date(data[i].added_at);
        console.log(added_full);
        var added_time = added_full.toString().split(' ')[4].substr(0,3);
        console.log(added_time);
        if (!cleanedData[added_time+'00']) {
            cleanedData[added_time+'00'] = 1;
        } else {
            cleanedData[added_time+'00'] += 1;
        }
    }
    console.log(cleanedData);
});