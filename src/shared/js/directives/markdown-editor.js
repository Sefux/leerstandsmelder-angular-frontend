'use strict';

var MarkdownEditorDirective = function () {
    return {
        link: function (scope, elem, attrs) {
            scope.editor = new SimpleMDE({element: elem[0]});
            scope.$watch(attrs.ngModel, function () {
                var ngModel = scope.$eval(attrs.ngModel);
                if (ngModel) {
                    scope.editor.value(ngModel);
                }
            });
        }
    };
};

MarkdownEditorDirective.$inject = ['markdownEditor'];

module.exports = MarkdownEditorDirective;