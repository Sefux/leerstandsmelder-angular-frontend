'use strict';

var DeviceReadyService = function () {
    return function (fn) {
        var queue = [],
            impl = function () {
                queue.push(Array.prototype.slice.call(arguments));
            };

        queue.addEventListener('deviceready', function () {
            queue.forEach(function (args) {
                fn.apply(this, args);
            });
            impl = fn;
        }, false);

        return function () {
            return impl.apply(this, arguments);
        };
    };
};