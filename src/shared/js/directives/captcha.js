'use strict';

var CaptchaDirective = function () {
    return {
        link: function (scope, elem, attrs) {
            scope.$parent.$on('captcha:update', function () {
                attrs.$set('src', '');
                attrs.$set('reset', false);
                attrs.$set('src', config.global.api_url + '/captchas.png?r=' + Date.now());
            });
            attrs.$set('src', config.global.api_url + '/captchas.png?r=' + Date.now());
        }
    };
};

module.exports = CaptchaDirective;