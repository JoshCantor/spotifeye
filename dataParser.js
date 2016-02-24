var fsp = require('fs-promise');

var danceData = {
		"name": 'danceability',
		"children": [{
			"name": "0 to 0.1",
			"min": 0, 
			"max": 0.1,
			"size" : 0
			}, {
			"name": "0.1 to 0.2",
			"min": 0, 
			"max": 0.1,
			"size": 0
			}, {
			"name": "0.2 to 0.3",
			"min": 0.2, 
			"max": 0.3,
			"size": 0
			}, {
			"name": "0.3 to 0.4",
			"min": 0.3, 
			"max": 0.4,
			"size": 0
			}, {
			"name": "0.4 to 0.5",
			"min": 0.4, 
			"max": 0.5,
			"size": 0
			}, {
			"name": "0.5 to 0.6",
			"min": 0.5, 
			"max": 0.6,
			"size": 0
			}, {
			"name": "0.6 to 0.7",
			"min": 0.6, 
			"max": 0.7,
			"size": 0
			}, {
			"name": "0.7 to 0.8",
			"min": 0.7, 
			"max": 0.8,
			"size": 0
			}, {
			"name": "0.8 to 0.9",
			"min": 0.8, 
			"max": 0.9,
			"size": 0
			}, {
			"name": "0.9 to 1",
			"min": 0.9, 
			"max": 1,
			"size": 0
			}]
};

// var getData = function () {
// 	fs.readdir('./jsondata', function(err, files) {
// 		if (err) throw err;
		
// 		var fileCount = 1;
// 		files.forEach(function(file) {
// 			fs.readFile("./jsondata/" + file, function(err, data) {
// 				if (err) throw err;
				
// 				// var trackPromise = new Promise(function(resolve, reject) {

// 				var json = JSON.parse(data.toString());
// 				if (json.response.track !== undefined) {
					
// 					var danceNum = json.response.track.audio_summary.danceability;
// 					danceData.children.forEach(function(range) {
// 						if(danceNum > range.min && danceNum < range.max) {
// 							range.size += 100;
// 							if(fileCount === files.length) {
// 								//console.log('data', danceData, fileCount, files.length);
// 								// return danceData;
// 							}
// 							fileCount += 1;
// 						}
						
// 					});
// 				}
			
// 			});	
// 		});
// 	});
// };
function getData () {
	return new Promise(function(resolve, reject) {
		try{
			fsp.readdir('./jsondata')
			.then(function(files) {
				
				var filePromises = [];
				files.forEach(function(file) {
					fileCount = 1;
					
					fsp.readFile("./jsondata/" + file)
					.then(function(data) {

						var json = JSON.parse(data.toString());
						if (json.response.track !== undefined) {
							
							var danceNum = json.response.track.audio_summary.danceability;
							danceData.children.forEach(function(range) {
								if(danceNum > range.min && danceNum < range.max) {
									range.size += 100;
									if(fileCount === files.length) {
										// console.log('data', danceData, fileCount, files.length);
										resolve(danceData);
									}
									fileCount += 1;
								}
								
							});

						}

					});

				});

			});
		}
		catch(e){
			reject(e);
		}	
	});	
};

// function addSize() {
// 	var json = JSON.parse(data.toString());
// 	if (json.response.track !== undefined) {
		
// 		var danceNum = json.response.track.audio_summary.danceability;
// 		danceData.children.forEach(function(range) {
// 			if(danceNum > range.min && danceNum < range.max) {
// 				range.size += 100;
// 			}
// 		});
// 	}
// }

getData().then(function(danceData) {
	// console.log(danceData);
	// module.exports = danceData;
	
});

module.exports = danceData;





