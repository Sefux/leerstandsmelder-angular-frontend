#!/usr/bin/env node

'use strict';

var nodeStatic = require('node-static'),
    fserver = new nodeStatic.Server(__dirname + '/../dist/mobile/'),
    port = 9090;

console.log('Starting static Leerstandsmelder UI server on port ' + port);
require('http').createServer(function (req, res) {
    req.addListener('end', function () {
        fserver.serve(req, res, function (err) {
            if (err) {
                res.writeHead(err.status, err.headers);
                res.end();
            }
        });
    }).resume();
}).listen(port);