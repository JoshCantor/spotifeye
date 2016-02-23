(function() {

    function login(callback) {
        var CLIENT_ID = 'ee6b01e0436142d99276de0c60695542';
        var REDIRECT_URI = 'http://mauricioandrades.github.io/?#3';

        function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
                '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
                '&scope=' + encodeURIComponent(scopes.join(' ')) +
                '&response_type=token';
        }

        var url = getLoginURL([
            'user-read-email'
        ]);

        var width = 450,
            height = 730,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2);

        window.addEventListener("message", function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                callback(hash.access_token);
            }
        }, false);

        var token = "";

window.location = url;

    }

    function getUserData(accessToken) {
        return $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
    }

    // var templateSource = document.getElementById('result-template').innerHTML,
        // template = Handlebars.compile(templateSource),
        // resultsPlaceholder = document.getElementById('result'),
        var loginButton = document.getElementById('btn-login');

    loginButton.addEventListener('click', function() {
        login(function(accessToken) {
            getUserData(accessToken)
                .then(function(response) {
                    // loginButton.style.display = 'none';
                    // resultsPlaceholder.innerHTML = template(response);
                    var hash = window.location.hash;
                    

                    if (hash) {
                      token = window.location.hash.split('&')[0].split('=')[1];
                      // target.postMessage(token, OAuthConfig.host);
                    }

                    console.log("hash");
                });
        });
    });

})();