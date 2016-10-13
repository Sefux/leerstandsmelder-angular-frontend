'use strict';

var StaticContentService = function ($translate, $http, assetPath) {
    return {
        getMarkdown: function (slug, cb) {
            var lang = $translate.use().toString(),
                url = assetPath + 'static/' + slug + '_' + lang + '.md';
            $http.get(url).then(function success(response) {
                cb(null, response.data);
            }, function error(response) {
                cb(new Error(response.statusText), null);
            });
        }
    };
};

StaticContentService.$inject = ['$translate', '$http', 'assetPath'];

module.exports = StaticContentService;