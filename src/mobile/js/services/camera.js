/* global Camera */
'use strict';

var CameraService = function ($rootScope, DeviceReadyService, $cordovaCamera, $q) {
    return {
        getPicture: function(onSuccess, onError/*, options */) {
            return DeviceReadyService.ready.then(function () {
                var options =  {
                    quality : 50,
                    destinationType : Camera.DestinationType.NATIVE_URI,
                    sourceType : Camera.PictureSourceType.CAMERA,
                    allowEdit : false,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 1000,
                    targetHeight: 1000,
                    //popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
                
                // var options = angular.extend({}, doptions, options);
                
                var deferred;
                deferred = $q.defer();
                $cordovaCamera.getPicture(options).then(function () {
                    var _this = this,
                        args = arguments;
                    var file = args[0];
                    // file = file.replace("assets-library://", "cdvfile://localhost/assets-library/");
                    if (typeof onSuccess === 'function') {
                        console.log('success function', _this);
                        $rootScope.$apply(function () {
                            console.log('success apply', file);
                            onSuccess.apply(_this, file);
                        });
                    }
                    deferred.resolve(file);
                }, function () {
                    var _this = this,
                        args = arguments;

                    if (typeof onError === 'function') {
                        $rootScope.$apply(function () {
                            onError.apply(_this, args[0]);
                        });
                    }
                    deferred.reject(args[0]);
                });
                return deferred.promise;
            });
        },
        getLibrary: function(onSuccess, onError/*, options*/) {
            return DeviceReadyService.ready.then(function () {
                var options =  {
                    quality : 50,
                    destinationType : Camera.DestinationType.NATIVE_URI,
                    sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit : false,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 1000,
                    targetHeight: 1000,
                    //popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
                
                var deferred;
                deferred = $q.defer();
                $cordovaCamera.getPicture(options).then(function () {
                    var _this = this,
                        args = arguments;
                    var file = args[0];
                    //file = file.replace("assets-library://", "cdvfile://localhost/assets-library/");    
                    if (typeof onSuccess === 'function') {
                        console.log('success function', _this);
                        $rootScope.$apply(function () {
                            console.log('success apply', file);
                            onSuccess.apply(_this, file);
                        });
                    }
                    deferred.resolve(file);
                }, function () {
                    var _this = this,
                        args = arguments;

                    if (typeof onError === 'function') {
                        $rootScope.$apply(function () {
                            onError.apply(_this, args[0]);
                        });
                    }
                    deferred.reject(args[0]);
                });
                return deferred.promise;
            });
        }
    };
};

CameraService.$inject = ['$rootScope', 'DeviceReadyService', '$cordovaCamera', '$q'];

module.exports = CameraService;