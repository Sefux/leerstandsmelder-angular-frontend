'use strict';

var CameraDirective = function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {


            elm.on('click', function() {
                navigator.camera.getPicture(function (imageURI) {
                    scope.$apply(function() {
                        ctrl.$setViewValue(imageURI);
                    });
                }, function (err) {
                    ctrl.$setValidity('error', false);
                }, {
                    quality : 50,
                    destinationType : Camera.DestinationType.FILE_URL,
                    sourceType : Camera.PictureSourceType.CAMERA,
                    allowEdit : true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 1000,
                    targetHeight: 1000,
                    //popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                })
            });
        }
    };
};


module.exports = CameraDirective;