'use strict';

var app = require('angular').module('leerstandsmelder');

app.factory('apiService', require('./api'));
app.factory('authService', require('./auth'));
app.factory('locationFormDefaults', require('./location-form-defaults'));
app.factory('mapService', require('./map'));
app.factory('regionService', require('./region'));
app.factory('responseHandler', require('./response-handler'));
app.factory('staticContent', require('./static-content'));
app.factory('CameraService', require('./camera'));
app.factory('uploadService', require('./upload'));