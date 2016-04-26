/* global angular,define,console */

define([], function () {
    return angular.module('lsm.services.auth', [])
        .factory('authService', [function () {
            var lsAlias = window.localStorage;
            try {
                lsAlias.setItem('test', '1');
                lsAlias.removeItem('test');
            } catch (e) {
                // TODO: add a cookie fallback if LocalStorage is not available.
                lsAlias = {};
                console.log('Warning: LocalStorage is not available.');
            }
            var auth = {
                lsAlias: lsAlias,
                api_key: null,
                access_token: null,
                getCredentials: function () {
                    auth.api_key = typeof this.lsAlias.api_key === 'string' ? JSON.parse(this.lsAlias.api_key) : null;
                    auth.access_token = typeof this.lsAlias.access_token === 'string' ? JSON.parse(this.lsAlias.access_token) : null;
                },
                setCredentials: function (api_key, access_token) {
                    this.lsAlias.api_key = JSON.stringify(api_key);
                    this.lsAlias.access_token = JSON.stringify(access_token);
                    auth.getCredentials();
                },
                clearCredentials: function () {
                    this.lsAlias.removeItem('api_key');
                    this.lsAlias.removeItem('access_token');
                    auth.getCredentials();
                }
            };
            auth.getCredentials();
            return auth;
        }]);
}());