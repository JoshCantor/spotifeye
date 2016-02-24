var knex = require('../server/db/knex');
var fs = require('fs');
var tracksToCheck = {};
var tracks = [];
var count = 0;
knex.column('track_id').select().from('tracks').then(function(data) {
    for (var i = 0; i < data.length; i++) {
        tracksToCheck[data[i].track_id] = true;
    }
    fs.readdir('../jsondata', function(err, files) {
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

    });
});