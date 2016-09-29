#!/usr/bin/env node

var static = require('node-static'),
    fserver = new static.Server('./dist/web/');

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
}).listen(9090);