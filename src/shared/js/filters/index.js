'use strict';

var app = require('angular').module('mapoz');

app.filter('artworkSinceRewrite', require('./artwork-since-rewrite'));
app.filter('artworkTypeClassName', function () {
  return function (item) {
    return item.substring(item.lastIndexOf(".") + 1);
  };
});
