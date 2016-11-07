'use strict';

var app = require('angular').module('leerstandsmelder');

app.directive('captcha', require('./captcha'));
app.directive('checkLogin', require('./check-login'));
app.directive('comments', require('./comments'));
app.directive('lightbox', require('./lightbox'));
app.directive('lsmDataTable', require('./lsm-data-table'));
app.directive('lsmMap', require('./lsm-map'));
app.directive('markdownEditor', require('./markdown-editor'));
app.directive('messageForm', require('./message-form'));
app.directive('msgPopup', require('./msg-popup'));
app.directive('recentLocations', require('./recent-locations'));
app.directive('recentPosts', require('./recent-posts'));
app.directive('tableEditButton', require('./table-edit-button'));
app.directive('tableDeleteButton', require('./table-delete-button'));