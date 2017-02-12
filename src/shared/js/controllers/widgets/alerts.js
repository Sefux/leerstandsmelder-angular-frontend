'use strict';



var WidgetsAlertsController = function ($scope,$mdToast, PubSub) {
    $scope.alerts = [];
    $scope.addAlert = function ( message) {
        $mdToast.hide();
        $mdToast.show($mdToast.simple().textContent(message.message).theme(message.type + "-toast"));
    };
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
    PubSub.subscribe('alert', $scope.addAlert);
};

WidgetsAlertsController.$inject = ['$scope', '$mdToast', 'PubSub'];

module.exports = WidgetsAlertsController;