'use strict';

var app = require('angular').module('leerstandsmelder');

app.filter('emptySinceRewrite', require('./empty-since-rewrite'));