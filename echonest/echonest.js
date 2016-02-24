/** @type {srcipt} [calls echonest api to circumvent the rate limiting] */
var request = require('request');
var dotenv = require('dotenv').config();
var apiKey = process.env.echonest_key;

console.log(apiKey);
arr = ["03kND9B8jZBbFlEtUZX7FC"];

for (var i = 0; i < arr.length; i++) {

    var options = {
        url: "http://developer.echonest.com/api/v4/track/profile?api_key="+ apiKey + "&format=json&id=spotify:track:" + arr[i] + "&bucket=audio_summary"
    };

    console.log(options.url);

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info);
      }
    }

    request(options, callback);
}

