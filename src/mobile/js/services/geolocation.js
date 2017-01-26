'use strict';

var GeolocationService = function ($rootScope, DeviceReadyService, $q) {
    return {
        getCurrentPosition: function(onSuccess, onError, options) {
            return DeviceReadyService.ready.then(function () {
                var deferred;
                deferred = $q.defer();
                navigator.geolocation.getCurrentPosition(function () {
                        var _this = this,
                            args = arguments;

                        if (typeof onSuccess === 'function') {
                            $rootScope.$apply(function () {
                                onSuccess.apply(_this, args);
                            });
                        }

                        deferred.resolve(args);
                    }, function () {
                        var _this = this,
                            args = arguments;

                        if (typeof onError === 'function') {
                            $rootScope.$apply(function () {
                                onError.apply(_this, args);
                            });
                        }

                        deferred.reject(args);
                    },
                    options);
                return deferred.promise;
            });
        }
    };
};

GeolocationService.$inject = ['$rootScope', 'DeviceReadyService', '$q'];

module.exports = GeolocationService;