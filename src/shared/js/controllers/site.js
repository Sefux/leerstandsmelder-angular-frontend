/* global angular,define,async,PIECEMETA_API_HOST,console */

define([
    'services_api',
    'services_helpers',
    'directives_widgets'
], function () {
    return angular.module(
        'lsm.controllers.site', [
            'lsm.services.api',
            'lsm.services.helpers',
            'lsm.directives.widgets',
            'btford.markdown'
        ])
        .controller('Site.StaticPage', ['$scope', '$q', 'staticContent', '$routeParams', 'apiService', function ($scope, $q, staticContent, $routeParams, apiService) {
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
                        content: apiContent.body
                    };
                    deferred.resolve();
                }
            });
        }]);
});
