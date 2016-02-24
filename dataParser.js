var fs = require('fs');

var parsed = {

};

fs.readdir('./jsondata', function(err, files) {
	if (err) throw err;
	files.forEach(function(file) {
		fs.readFile("./jsondata/" + file, function(err, data) {
			if (err) throw err;
			var json = JSON.parse(data.toString());
			if (json.response.track !== undefined) {
				console.log(file, 'dance', json.response.track.audio_summary.danceability);
			}		
		});
	});
});

