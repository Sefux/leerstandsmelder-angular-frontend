'use strict';

var config = require('../../../../config.json');

var ApiService = function (authService, $cordovaFileTransfer) {
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
                    
                    console.log('uploadIMage',file);
                  // Destination URL
                  var url = config.global.api_url + '/photos';
                 
                  // File for Upload
                  var targetPath = file;//$scope.pathForImage($scope.image);
                 
                  // File name only
                  //var filename = file.name; //$scope.image;;
                 
                  var options = {
                    fileKey: "file",
                    fileName: 'filename.jpg',
                    chunkedMode: false,
                    mimeType: "multipart/form-data",
                    params : {'fileName': 'filename.jpg', 'location_uuid': location.uuid}
                  };
                console.log('token',authService.access_token); 
                  var params = new Object();
                options.headers = {'Authorization': apiClient.authUtil.getTokenHeader(authService.access_token)};
                //options.params = params;
                //options.params.push();
                
                 console.log('transferOptions',options);
                  $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
                    console.log('Success', 'Image upload finished.',result);
                  }, function(err) {
                    console.log("ERROR: " ,err);
                  }, function (progress) {
                    // constant progress updates
                  });
                  
                  
                  
                    console.log('api upload',data);
                    console.log('api upload url', config.global.api_url + '/photos');
                    Upload.upload({
                        url: config.global.api_url + '/photos',
                        headers: {'Authorization': apiClient.authUtil.getTokenHeader(authService.access_token)},
                        fields: data.fields,
                        file: data.file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt);
                        if (typeof progress === 'function') {
                            progress(evt.loaded, evt.total);
                        }
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + ' uploaded. Response: ', data);
                        console.log('status: ', status);
                        console.log('headers: ', headers);
                        console.log('config: ', config);
                        if (typeof callback === 'function') {
                            callback(null, data);
                        }
                    }).error(function (data, status) {
                        console.log('error status: ', status);
                        console.log('error data: ', data);
                        if (typeof callback === 'function') {
                            callback(new Error('upload error status ' + status), data);
                        }
                    });
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

ApiService.$inject = ['authService', '$cordovaFileTransfer'];

module.exports = ApiService;
