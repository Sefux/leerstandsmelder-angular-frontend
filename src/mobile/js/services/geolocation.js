'use strict';

var GeolocationService = function ($rootScope, DeviceReadyService) {

	return {
		getCurrentPosition: DeviceReadyService(function (onSuccess, onError, options) {
			navigator.geolocation.getCurrentPosition(function () {
					var that = this,
						args = arguments;

					if (onSuccess) {
						$rootScope.$apply(function () {
							onSuccess.apply(that, args);
						});
					}
				}, function () {
					var that = this,
						args = arguments;

					if (onError) {
						$rootScope.$apply(function () {
							onError.apply(that, args);
						});
					}
				},
				options);
		})
	};
};

GeolocationService.$inject = ['$rootScope', 'DeviceReadyService'];

module.exports = GeolocationService;