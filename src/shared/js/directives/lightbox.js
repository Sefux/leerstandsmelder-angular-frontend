'use strict';

var LightboxDirective = function ($mdDialog, assetPath, $translate) {
    return {
        scope: true,
        link: function (scope, elem, attrs) {
            elem.addClass('image-click');
            elem.bind('click', function () {
                $mdDialog.show($mdDialog.confirm()
                    .clickOutsideToClose(true)
                    .htmlContent('<img class="spot-image" src="'+ attrs.ngOriginalUrl +'" style="width:100%" />')
                    .hasBackdrop(false)
                    .ariaLabel('.title')
                    .ok($translate.instant('actions.close')));
            });
        }
    };
};

LightboxDirective.$inject = ['$mdDialog', 'assetPath', '$translate'];

module.exports = LightboxDirective;
