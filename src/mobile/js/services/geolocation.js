'use strict';

var GeolocationService = function ($rootScope, DeviceReadyService, $q) {

	return {
		getCurrentPosition: function() {
			var deferred;
			deferred = $q.defer();
			DeviceReadyService(function (onSuccess, onError, options) {
				navigator.geolocation.getCurrentPosition(function () {
						var that = this,
							args = arguments;

						if (onSuccess) {
							$rootScope.$apply(function () {
								onSuccess.apply(that, args);
							});
						}
						deferred.resolve(args);
					}, function () {
						var that = this,
							args = arguments;

						if (onError) {
							$rootScope.$apply(function () {
								onError.apply(that, args);
							});
						}

						deferred.reject(args);
					},
					options);
			});
			return deferred.promise;
		}
	};
};

GeolocationService.$inject = ['$rootScope', 'DeviceReadyService', '$q'];

module.exports = GeolocationService;