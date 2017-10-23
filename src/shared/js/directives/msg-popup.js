/* global marked */

'use strict';

var MsgPopupDirective = function (staticContent, $mdDialog, $translate) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            if (localStorage['popups.' + attrs.popupId]) {
                return;
            }
            staticContent.getMarkdown('popups_' + attrs.popupId, function (err, data) {
                if (!err) {
                    scope.popupContent = data;
                    var html = marked(data);
                    $mdDialog.show($mdDialog.confirm()
                        .clickOutsideToClose(true)
                        .title($translate.instant('popups.' + attrs.popupId + '.title'))
                        .htmlContent(html)
                        .hasBackdrop(false)
                        .ariaLabel($translate.instant('popups.' + attrs.popupId + '.title'))
                        .ok($translate.instant('actions.ok'))
                        .cancel($translate.instant('actions.dont_show_again')))
                        .then(function () {}, function () {
                            try {
                                localStorage['popups.' + attrs.popupId] = '1';
                            } catch (e) {
                                console.log('Warning: LocalStorage is not available.');
                            }
                        });
                }
            });
        }
    };
};

MsgPopupDirective.$inject = ['staticContent', '$mdDialog', '$translate'];

module.exports = MsgPopupDirective;
