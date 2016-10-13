'use strict';

var MessageFormDirective = function (apiService, assetPath) {
    return {
        restrict: 'A',
        templateUrl: assetPath + 'partials/_message_create.html',
        link: function (scope) {
            scope.submitMessage = function () {
                if (scope.message.recipient_uuid && scope.message.body) {
                    apiService('messages').actions.create(scope.message, function (err) {
                        // TODO: handle this error...
                        console.log('msg form err:', err.message);
                    });
                }
            };
        }
    };
};

MessageFormDirective.$inject = ['apiService', 'assetPath'];

module.exports = MessageFormDirective;