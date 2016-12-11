#!/usr/bin/env node

'use strict';

var nodeStatic = require('node-static'),
    fserver = new nodeStatic.Server(__dirname + '/../dist/web/'),
    port = require('../config.json').global.serve_web_ui_port || 9090;

console.log('Starting static MAPOZ UI server on port ' + port);
require('http').createServer(function (req, res) {
    req.addListener('end', function () {
        fserver.serve(req, res, function (err) {
            if (err) {
                if (err.status === 404) {
                    fserver.serveFile('/index.html', 200, {}, req, res);
                } else {
                    res.writeHead(err.status, err.headers);
                    res.end();
                }
            }
        });
    }).resume();
}).listen(port);