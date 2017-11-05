'use strict';

var StaticPageController = function ($scope, $q, staticContent, $routeParams, apiService) {
    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    apiService('posts').actions.find($routeParams.slug, function (err, apiContent) {
        if (err || !apiContent) {
            staticContent.getMarkdown($routeParams.slug, function (err, content) {
                $scope.page = {
                    content: content
                };
                deferred.resolve();
            });
        } else {
            $scope.page = {
                title: apiContent.title,
                content: apiContent.body
            };
            deferred.resolve();
        }
    });
};

StaticPageController.$inject = ['$scope', '$q', 'staticContent', '$routeParams', 'apiService'];

module.exports = StaticPageController;
