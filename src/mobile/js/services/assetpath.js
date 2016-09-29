/* global angular,define */

define([
    'services_assetpath'
], function () {
    return angular.module('lsm.services.assetpath', []).
    factory('assetPath', function () {
        return '../www/'; // '/android_asset/www/';
    });
});