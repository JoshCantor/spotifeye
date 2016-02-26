angular.module("spotifeyeApp")
	.factory("lockWindow", function() {
		var obj = {};

		obj.showLogin = true;

		obj.hideLogin = function() {
			obj.showLogin = false;
		}

		return obj;
	})