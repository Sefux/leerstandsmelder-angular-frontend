/* global airbrakeJs */

'use strict';

var config = require('../../../../config.json');

var ErrorReporterService = function () {
    var client = null;
    if (config.global.airbrake.project_id && config.global.airbrake.project_key) {
        client = new airbrakeJs.Client({
            projectId: config.global.airbrake.project_id,
            projectKey: config.global.airbrake.project_key
        });
    }
    return {
        client: client,
        notify: function (err) {
            if (this.client) {
                this.client.notify(err);
            }
        },
        wrap: function (func) {
            if (this.client) {
                return this.client.wrap(func);
            } else {
                return func;
            }
        }
    };
};

module.exports = ErrorReporterService;