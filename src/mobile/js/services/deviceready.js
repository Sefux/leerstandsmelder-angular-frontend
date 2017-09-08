'use strict';

var DeviceReadyService = function ($document, $timeout, $window, $q) {
    var timeoutMs = 2000,
        isReady = $q.defer();
    this.ready =  isReady.promise;

    var cordovaTimeout = $timeout(function() {
        if ($window.cordova){
            isReady.resolve($window.cordova);
        } else {
            isReady.reject("cordova init timeout");
        }
    }, timeoutMs);

    angular.element($document)[0].addEventListener('deviceready', function() {
        $timeout.cancel(cordovaTimeout);
        isReady.resolve($window.cordova);
    });

    return this;
};

DeviceReadyService.$inject = ['$document', '$timeout', '$window', '$q'];

module.exports = DeviceReadyService;