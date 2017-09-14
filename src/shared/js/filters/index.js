'use strict';

var app = require('angular').module('mapoz');

app.filter('artworkSinceRewrite', require('./artwork-since-rewrite'));