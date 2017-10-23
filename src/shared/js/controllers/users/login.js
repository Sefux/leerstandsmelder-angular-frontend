'use strict';

var UsersLoginController = function ($scope, $q, $location, apiService, responseHandler, configuration, $translate, $rootScope, PubSub, $routeParams) {
    $scope.user = {
        email: null,
        password: null
    };
    $scope.$parent.status = 'ready';
    $scope.submit = function () {
        var deferred = $q.defer();
        $scope.promise = deferred.promise;
        apiService().authenticate($scope.user.email, $scope.user.password, function (err) {
            if (responseHandler.handleResponse(err, deferred)) {
                PubSub.publish('alert', {type: 'success', message: $translate.instant('successes.user.login')});
                $rootScope.$broadcast('currentUser:updated', true);
                var redirect = '/';
                // if($routeParams.hasOwnProperty('redirectTo') {
                // //    redirect = $routeParams.redirectTo;
                // }
                //var redirect_path = (configuration.urlbase || '/') + redirect;
                $location.path( redirect);

            }
        });
    };
};

UsersLoginController.$inject = ['$scope', '$q', '$location', 'apiService', 'responseHandler', 'configuration','$translate', '$rootScope', 'PubSub', '$routeParams'];

module.exports = UsersLoginController;
