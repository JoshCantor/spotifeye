angular.module("spotifeyeApp")
	.factory("lockWindow", function() {
		var obj = {};

		obj.showLogin = true;

		obj.hideLogin = function() {
			obj.showLogin = false;
			console.log('show', obj.showLogin);
		}

		return obj;
	})