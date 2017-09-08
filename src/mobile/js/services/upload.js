'use strict';

var config = require('../../../../config.json');

var UploadService = function ($cordovaFileTransfer) {
    return {
        upload: function (data, callback, progress) {
            
          // Destination URL
          var url = config.global.api_url + '/photos';
         
          // File for Upload
          var targetPath = data.file;//$scope.pathForImage($scope.image);
         
          // File name only
          //var filename = file.name; //$scope.image;;
          var d = new Date();
          var uniqueNewFilename = Date.parse(d) + ".jpg";
          var options = {
            fileKey: "file",
            fileName: uniqueNewFilename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params : data.fields
          };
          options.params.fileName = uniqueNewFilename;
         
          options.headers = {'Authorization': data.authenticationHeader};
        
          $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
            if (typeof callback === 'function') {
                callback(null, result);
            }
          }, function(err) {
            console.log("ERROR: " ,err);
            if (typeof callback === 'function') {
                callback(new Error('upload error status ' + err), err);
            }
          }, function (evt) {
              console.log('progress evt: ', evt);
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' + evt);
              if (typeof progress === 'function') {
                  progress(evt.loaded, evt.total);
              }
            // constant progress updates
            if (typeof progress === 'function') {
                progress(evt.loaded, evt.total);
            }
          });
          
        }
    };
};

UploadService.$inject = ['$cordovaFileTransfer'];

module.exports = UploadService;