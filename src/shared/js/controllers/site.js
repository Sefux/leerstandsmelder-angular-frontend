/* global angular,define,async,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module(
        'leerstandsmelder.controllers.site', [
            'ito.angular.services.api'
        ]);
});
