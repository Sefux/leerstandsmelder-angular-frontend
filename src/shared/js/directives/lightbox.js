'use strict';

var LightboxDirective = function ($mdDialog) {
    return {
        link: function (scope, elem, attrs) {
            elem.addClass('image-click');
            elem.on('click', function () {
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
                $mdDialog.show(dialog);
            });
        }
    };
};

LightboxDirective.$inject = ['$mdDialog'];

module.exports = LightboxDirective;