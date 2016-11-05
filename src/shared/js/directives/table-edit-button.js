'use strict';

var TableEditButtonDirective = function () {
    return {
        template: '<md-button class="md-icon-button" ng-click="clientScope.itemClick(this)" aria-label="{{ \'actions.edit\' | translate }}"><md-icon class="fa fa-fw fa-2x fa-pencil"></md-icon></md-button>',
    };
};

module.exports = TableEditButtonDirective;