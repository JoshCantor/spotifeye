var knex = require('../server/db/knex');
var fs = require('fs');
var request = require('request');
require('dotenv').load();
            // console.log('key', process.env.echonest_key);

var tracksToCheck = {};
var tracks = [];
var count = 0;
knex.column('track_id').select().from('tracks').then(function(data) {
    for (var i = 0; i < data.length; i++) {
        tracksToCheck[data[i].track_id] = true;
    }
    fs.readdir('./jsondata', function(err, files) {
        if (err) throw err;
        files.forEach(function(file) {
        	var fileName = file.split('.')[0];
            // if (!tracksToCheck[fileName]) {
            // 	count++;
            // 	console.log(count);
            // }
            // if (tracksToCheck[fileName]) {
            // 	console.log(file);
            // }
        	tracksToCheck[fileName] = false;
        });
        // console.log(tracksToCheck);
        for(var prop in tracksToCheck) {
        	if(tracksToCheck[prop]) {
        		tracks.push(prop);
        	} else {
        		count++;
        		// console.log(count, prop);
        	}
        }
        // console.log(tracks);
        console.log('final array length = ',tracks.length);
        console.log('skipped track count = ',count);
        ////////////////////////////////////////////////////
        //pass tracks array into EchoNest API call code here:
        for (var j = 0; j<20; j++) {
            // console.log(tracks[j]);
            var options = {
                url: "http://developer.echonest.com/api/v4/track/profile?api_key=" + process.env.echonest_key + "&format=json&id=spotify:track:" + tracks[j] + "&bucket=audio_summary"
            };
            request(options, generateFileCallback(j));
        }
    });
});

function generateFileCallback(j) {
    return function callback(error, response, body) {
        // console.log(body);
        if (!error && response.statusCode === 200) {
            var info = JSON.parse(body);
            // console.log(info);
            fs.writeFile('jsondata/' + tracks[j] + '.json', body);
        } else {
            console.log('no work');
        }
    };
}



