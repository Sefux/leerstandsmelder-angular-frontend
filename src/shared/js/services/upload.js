'use strict';

var config = require('../../../../config.json');

var UploadService = function (Upload) {
    return {
        upload: function (data, callback, progress) {
            console.log('api upload',data);
            console.log('api upload url', config.global.api_url + '/photos');
            Upload.upload({
                url: config.global.api_url + '/photos',
                headers: {'Authorization': data.authenticationHeader},
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
        }
    };
};

UploadService.$inject = ['Upload'];

module.exports = UploadService;
