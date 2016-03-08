/* global angular,LEERSTANDSMELDER_API_HOST,PMApi */
angular.module('ito.angular.services.api', []).
    factory('apiService', ['authService', 'Upload', function (authService, Upload) {
        'use strict';
        return function (resourceName, host, query) {
            var apiClient = new LMApi({
                host: host ? host : LEERSTANDSMELDER_API_HOST,
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
                        Upload.upload({
                            url: LEERSTANDSMELDER_API_HOST + '/photos',
                            headers: {'Authorization': apiClient.authUtil.getTokenHeader(authService.access_token)},
                            fields: data.fields,
                            file: data.file
                        }).progress(function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                            if (typeof progress === 'function') {
                                progress(evt.loaded, evt.total);
                            }
                        }).success(function (data, status, headers, config) {
                            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                            if (typeof callback === 'function') callback(null, data);
                        }).error(function (data, status, headers, config) {
                            console.log('error status: ' + status);
                            if (typeof callback === 'function') callback(new Error('upload error status ' + status), data);
                        });
                    }
                },
                getCredentials: function (access_token, callback) {
                    apiClient.setToken(access_token);
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
                authenticate: function (login, password, callback) {
                    apiClient.getToken({login: login, password: password}, function (err, token) {
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
    }]);

