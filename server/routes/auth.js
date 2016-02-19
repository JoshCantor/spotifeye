var express = require("express");
var router = express.Router();

var passport = require("passport");
var SpotifyStrategy = require('passport-spotify').Strategy;

passport.use(new SpotifyStrategy({
	clientID:"1857c7c8664f4600b762dc603227be89",
	clientSecret:"00d15fc31efb436ea0a012ef7af2a248",
	callbackURL:"http://localhost:3000/auth/spotify/callback"
},
function(accessToken, refreshToken, profile, done){

	return done(null, profile);
}))

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

router.get('/spotify', passport.authenticate('spotify'), function(req, res){
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
    console.log("spotify is called to authenticate")
});

router.get('/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/login' }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/success');
});

router.get('/success',function(req,res){
	console.log("sucessful auth")
});

module.exports = {
	router:router,
	passport:passport
}