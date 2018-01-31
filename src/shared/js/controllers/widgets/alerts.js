'use strict';



var WidgetsAlertsController = function ($scope, $translate, $mdToast, $mdDialog, PubSub) {
    $scope.alerts = [];
    $scope.addAlert = function ( message) {
        if(message.type === 'critical') {
          var dialog = $mdDialog.alert()
          .title($translate.instant('errors.critical.title'))
          .textContent(message.message)
          .ariaLabel($translate.instant('errors.critical.title'))
          .ok($translate.instant('errors.critical.resolve'));
          dialog.escapeToClose = false;

          $mdDialog.show(dialog);
        } else {

          var delay = 8000;
          if(message.hasOwnProperty(delay)) {
            delay = message.delay;
          }
          $mdToast.hide();
          $mdToast.show(
            $mdToast.simple()
              .textContent(message.message)
              .hideDelay(delay)
              .theme(message.type + "-toast"));
        }

    };
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
    PubSub.subscribe('alert', $scope.addAlert);
};

WidgetsAlertsController.$inject = ['$scope', '$translate', '$mdToast', '$mdDialog', 'PubSub'];

module.exports = WidgetsAlertsController;
