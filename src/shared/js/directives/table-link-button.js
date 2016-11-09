'use strict';

var TableLinkButtonDirective = function () {
    return {
        template: '<md-button class="md-table-button md-raised md-fab  md-mini " ng-click="clientScope.clickShowHandler(this)" aria-label="{{ \'actions.show\' | translate }}"><md-icon md-font-icon="fa-eye" class="fa"></md-icon></md-button>',
            /*
            function($element, $attrs) {
            return '<md-button class="md-table-button md-raised md-fab  md-mini " ng-click="clientScope.showClick(this)" aria-label="{{ \'actions.show\' | translate }}"><md-icon md-font-icon="fa-eye" class="fa"></md-icon>' + $element.title + '</md-button>';
        },
        */

    };
};

module.exports = TableLinkButtonDirective;