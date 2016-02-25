var fsp = require('fs-promise');

var danceData = {
		"name": 'danceability',
		"children": [{
			"name": "0 to 0.1",
			"min": 0, 
			"max": 0.1,
			"children": []
			}, {
			"name": "0.1 to 0.2",
			"min": 0, 
			"max": 0.1,
			"children": []
			}, {
			"name": "0.2 to 0.3",
			"min": 0.2, 
			"max": 0.3,
			"children": []
			}, {
			"name": "0.3 to 0.4",
			"min": 0.3, 
			"max": 0.4,
			"children": []
			}, {
			"name": "0.4 to 0.5",
			"min": 0.4, 
			"max": 0.5,
			"children": []
			}, {
			"name": "0.5 to 0.6",
			"min": 0.5, 
			"max": 0.6,
			"children": []
			}, {
			"name": "0.6 to 0.7",
			"min": 0.6, 
			"max": 0.7,
			"children": []
			}, {
			"name": "0.7 to 0.8",
			"min": 0.7, 
			"max": 0.8,
			"children": []
			}, {
			"name": "0.8 to 0.9",
			"min": 0.8, 
			"max": 0.9,
			"children": []
			}, {
			"name": "0.9 to 1",
			"min": 0.9, 
			"max": 1,
			"children": []
			}]
};

function getData () {
	return new Promise(function(resolve, reject) {
		try{
			fsp.readdir('./jsondata')
			.then(function(files) {
				
				fileCount = 1;

				files.forEach(function(file) {
					
					
					fsp.readFile("./jsondata/" + file)
					.then(function(data) {

						var json = JSON.parse(data.toString());
						
						if (json.response.track !== undefined) {
							var danceNum = json.response.track.audio_summary.danceability,
								artist = json.response.track.artist;

							//loop through danceData children
							for (var i = 0; i < danceData.children.length; i++) {
								var rangeObj = danceData.children[i];

								if (danceNum > rangeObj.min && danceNum < rangeObj.max) {
									var artistIncluded = false;

									//loop through rangeObj children;
									for (var j = 0; j < rangeObj.children.length; j++) {
										var artistObj = rangeObj.children[j];

										if (artistObj.name === artist) {
											artistIncluded = true;
											artistObj.size += 100;
										}
									};

									if (!artistIncluded) {
										rangeObj.children.push({"name": artist, "size": 100});
									}

									if(fileCount === files.length) {
										resolve(danceData);
									}
									
								}
								
							};
							fileCount += 1;

						} else {
							fileCount += 1;
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


getData().then(function(danceData) {
	console.log(danceData.children[5].children);
	// module.exports = danceData;
	
}).catch(function(err) {
	throw err;
});



module.exports = danceData;

