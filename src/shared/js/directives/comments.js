'use strict';

var CommentsDirective = function (apiService, responseHandler, $q, assetPath, $mdDialog, $translate) {
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
            scope.hideComment = function (uuid, index) {


                  var confirm = $mdDialog.confirm()
                      .title($translate.instant('comments.remove_confirm_title'))
                      .textContent($translate.instant('comments.remove_confirm_body'))
                      .ariaLabel('comments.remove_confirm_title')
                      .ok($translate.instant('actions.ok'))
                      .cancel($translate.instant('actions.cancel'));
                  $mdDialog.show(confirm).then(function () {
                      var deferred = $q.defer();
                      scope.promise = deferred.promise;
                      apiService('comments').actions.remove(uuid, function (err) {
                          var msgs = {
                              success: 'comments.remove_success'
                          };
                          if (responseHandler.handleResponse(err, deferred, msgs)) {

                              scope.$applyAsync(function () {
                                //scope.comments.splice(scope.comments.indexOf(comment));
                                scope.comments.splice(index);
                              });
                          }
                      });
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
                    }, function(){}, false);
                }
            });
        }
    };
};

CommentsDirective.$inject = ['apiService', 'responseHandler', '$q', 'assetPath', '$mdDialog', '$translate'];

module.exports = CommentsDirective;
