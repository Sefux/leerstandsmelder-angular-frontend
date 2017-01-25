'use strict';

var GeolocationService = function ($rootScope, $q, $window, $timeout) {

	var factoryObj = {};

	factoryObj.getCurrentPosition = function() {
		var deferred;
		var promiseTimeout = $timeout(function() {
			deferred.reject(1); // return 1 if browser waited for user input for more than timeout delay
		}, 30000);

		deferred = $q.defer();

		if(!$window.navigator.geolocation) { // check if geoLocation is not supported by browser
			$timeout.cancel(promiseTimeout);
			deferred.reject(false); // return false if geoLocation is not supported
		}
		else { // geoLocation is supported
			$window.navigator.geolocation.getCurrentPosition(function(position) {
				$timeout.cancel(promiseTimeout);
				return deferred.resolve(position);
			}, function(error) {
				$timeout.cancel(promiseTimeout);
				return deferred.reject(error.code || 1);
			});
		}

		return deferred.promise;
	};

	return factoryObj;
};

GeolocationService.$inject = ['$rootScope','$q','$window', '$timeout'];

module.exports = GeolocationService;