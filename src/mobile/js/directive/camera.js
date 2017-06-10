'use strict';

var CameraDirective = function ($cordovaCamera) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            var options = {
                quality : 50,
                destinationType : Camera.DestinationType.NATIVE_URI,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1000,
                targetHeight: 1000,
                //popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            elm.on('click', function() {
                $cordovaCamera.getPicture(options).then(function (imageURI) {
                    console.log('getPicture from CameraDirective', imageURI);
                    //scope.new_files.push(imageURI);
                    /*
                    scope.$apply(function() {
                        ctrl.$setViewValue(imageURI);
                    });
                    */
                }, function (err) {
                    ctrl.$setValidity('error', false);
                });
            });
        }
    };
};

CameraDirective.$inject = ['$cordovaCamera'];
module.exports = CameraDirective;