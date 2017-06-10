'use strict';

var CameraService = function ($rootScope, $q) {
    return {
        getPicture: function() {
            return '';
        }
    };
};

CameraService.$inject = ['$rootScope', '$q'];

module.exports = CameraService;