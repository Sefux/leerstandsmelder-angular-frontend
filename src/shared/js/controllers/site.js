/* global angular,define,async,PIECEMETA_API_HOST,console */

define([
    'services_helpers',
    'directives_widgets'
], function () {
    return angular.module(
        'lsm.controllers.site', [
            'lsm.services.helpers',
            'lsm.directives.widgets',
            'btford.markdown'
        ])
        .controller('Site.StaticPage', ['$scope', '$q', 'staticContent', '$routeParams', function ($scope, $q, staticContent, $routeParams) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            staticContent.getMarkdown($routeParams.slug, function (err, content) {
                $scope.page = {
                    content: content
                };
                deferred.resolve();
            });
        }]);
});
