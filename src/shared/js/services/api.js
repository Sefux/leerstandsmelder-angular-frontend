'use strict';

var config = require('../../../../config.json');

var ApiService = function (authService, uploadService) {
    return function (resourceName, host, query) {
        var apiClient = new LMApi({
            host: host ? host : config.global.api_url,
            contentType: 'application/json',
            api_key: authService.api_key,
            access_token: authService.access_token
        });
        return {
            client: apiClient,
            actions: {
                all: function (callback, progress) {
                    apiClient.resource(resourceName, query).action('get', null, callback, progress);
                },
                find: function (uuid, callback, progress) {
                    apiClient.resource(resourceName, query).action('get', uuid, callback, progress);
                },
                create: function (data, callback, progress) {
                    apiClient.resource(resourceName).action('post', data, callback, progress);
                },
                update: function (uuid, data, callback, progress) {
                    data.uuid = uuid;
                    apiClient.resource(resourceName).action('put', data, callback, progress);
                },
                remove: function (uuid, callback, progress) {
                    apiClient.resource(resourceName).action('delete', uuid, callback, progress);
                },
                upload: function (data, callback, progress) {
                    data.authenticationHeader = apiClient.authUtil.getTokenHeader(authService.access_token);
                    uploadService.upload(data, callback, progress);    
                },
                ping: function(callback, progress) {
                  apiClient.resource('ping').action('get', '0', callback, progress);
                }
            },
            getCredentials: function (access_token, callback) {
                apiClient.setAccessToken(access_token);
                apiClient.getCredentials(function (err, credentials) {
                    if (err) {
                        return callback(err);
                    }
                    if (typeof credentials === 'object') {
                        authService.setCredentials(credentials, access_token);
                        callback(null);
                    } else {
                        callback(new Error('Failed to get credentials'));
                    }
                });
            },
            authenticate: function (email, password, callback) {
                apiClient.getToken({email: email, password: password}, function (err, token) {
                    if (err) {
                        return callback(err);
                    }
                    if (typeof token === 'object') {
                        apiClient.getCredentials(function (err, credentials) {
                            if (err) {
                                return callback(err);
                            }
                            if (typeof credentials === 'object') {
                                authService.setCredentials(credentials, token);
                                callback(null);
                            } else {
                                callback(new Error('Failed to get credentials'));
                            }
                        });
                    } else {
                        callback(new Error('Failed to get token'));
                    }
                });
            }
        };
    };
};

ApiService.$inject = ['authService', 'uploadService'];

module.exports = ApiService;
