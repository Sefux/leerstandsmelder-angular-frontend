'use strict';

var app = require('angular').module('leerstandsmelder');

app.filter('artworkSinceRewrite', require('./artwork-since-rewrite'));