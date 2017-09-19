'use strict';

var LightboxDirective = function ($mdDialog, $translate) {
    return {
        link: function (scope, elem, attrs) {
            elem.addClass('image-click');
            elem.on('click', function () {
                /*
                var dialog = $mdDialog.confirm({
                    templateUrl: '/partials/_lightbox.html',
                    clickOutsideToClose: true,
                    controller: function controller(scope, $mdDialog) {
                        scope.image = attrs.src;
                        scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                    }
                });
                console.log('dialog',dialog);
                $mdDialog.show(dialog);
                */
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

LightboxDirective.$inject = ['$mdDialog', '$translate'];

module.exports = LightboxDirective;