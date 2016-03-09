/* global angular,define */

define([], function () {
    return angular.module('ito.angular.services.dataviewer.api', [])
    .factory('mapApiService', ['$http', function ($http) {
        'use strict';

        var getResponseHandler = function (cb) {
            return function apiResponse(response) {
                cb(null, response);
            };
        };

        var getErrorHandler = function (cb) {
            return function apiError(data, status) {
                cb(new Error('Service error:', data, status), null);
            };
        };

        return {
            starImage: function (image_id, contributor_id, stars, cb) {
                $http({
                    method: 'POST',
                    url: '/api/stars/' + image_id + '/' + contributor_id + '/' + stars
                }).success(getResponseHandler(cb)).error(getErrorHandler(cb));
            },
            getUserStars: function (contributor_id, cb) {
                $http({method: 'GET', url: '/api/userstars/' + contributor_id})
                    .success(getResponseHandler(cb)).error(getErrorHandler(cb));
            },

            getAllImages: function (cb) {
                $http({method: 'GET', url: '/api/images'})
                    .success(getResponseHandler(cb)).error(getErrorHandler(cb));
            },
            get10Images: function (offset, cb) {
                $http({
                    method: 'GET',
                    url: '/api/images',
                    params: {limit: 10, offset: offset}
                }).success(getResponseHandler(cb)).error(getErrorHandler(cb));
            },
            getImageData: function (id, cb) {
                $http({
                    method: 'GET',
                    url: '/api/imagedata/' + id,
                    params: {limit: 1, offset: 0}
                }).success(getResponseHandler(cb)).error(getErrorHandler(cb));
            },
            getLatestImages: function (cb) {
                $http({method: 'GET', url: '/api/images', params: {limit: 7}})
                    .success(getResponseHandler(cb)).error(getErrorHandler(cb));
            },
            imageUnload: function (image_id, username, cb) {
                $http({
                    method: 'POST',
                    url: '/api/imageunload/' + image_id + '/' + username
                }).success(getResponseHandler(cb)).error(getErrorHandler(cb));
            }
        };
    }]);
});
