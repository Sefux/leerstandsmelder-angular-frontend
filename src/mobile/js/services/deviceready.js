'use strict';

var DeviceReadyService = function () {
    return function (fn) {
        var queue = [],
            impl = function () {
                queue.push(Array.prototype.slice.call(arguments));
            };

        document.addEventListener('deviceready', function () {
	        console.log('EventListener deviceready');
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

module.exports = DeviceReadyService;