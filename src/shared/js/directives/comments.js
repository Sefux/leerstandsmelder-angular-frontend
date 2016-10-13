'use strict';

var CommentsDirective = function (apiService, responseHandler, $q, assetPath) {
    return {
        restrict: 'A',
        templateUrl: assetPath + 'partials/_comments.html',
        link: function (scope, elem, attrs) {
            scope.new_comment = {};
            scope.submitComment = function () {
                var deferred = $q.defer();
                scope.promise = deferred.promise;
                if (!scope.new_comment.body) {
                    return;
                }
                var obj = {
                    subject_uuid: scope.$eval(attrs.uuid),
                    body: scope.new_comment.body,
                    captcha: scope.new_comment.captcha ? scope.new_comment.captcha : 'nocaptcha'
                };
                apiService('comments').actions.create(obj, function (err, comment) {
                    var msgs = {
                        success: 'messages.comments.create_success'
                    };
                    if (responseHandler.handleResponse(err, deferred, msgs)) {
                        scope.$applyAsync(function () {
                            scope.comments.push(comment);
                            scope.new_comment = {};
                        });
                        scope.$broadcast('captcha:update', true);
                    } else {
                        scope.$broadcast('captcha:update', true);
                    }
                });
            };
            scope.$watch(attrs.uuid, function () {
                var uuid = scope.$eval(attrs.uuid);
                if (uuid) {
                    var url = [attrs.resource, uuid, 'comments'].join('/');
                    apiService(url)
                        .actions.all(function (err, comments) {
                        // TODO: api result format must be unified!
                        scope.$applyAsync(function () {
                            if (comments && comments.results) {
                                scope.comments = comments.results;
                            } else if (comments) {
                                scope.comments = comments;
                            }
                        });
                    });
                }
            });
        }
    };
};

CommentsDirective.$inject = ['apiService', 'responseHandler', '$q', 'assetPath'];

module.exports = CommentsDirective;