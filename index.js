'use strict';
var ono = require('ono');
var statuses = require('statuses');
var codes = statuses.codes;

var httpErrors = {};

codes.forEach(function (code) {
    var statusMessage = statuses[code];
    var identifier = toIdentifier(statusMessage);

    httpErrors[code] = OnoHttp[identifier] = function () {
        var args = Array.prototype.slice.call(arguments);
        var err = ono.apply(this, args);
        err.status = code;
        err.statusCode = code;
        if (!args.length || !err.message) {
            err.message = statusMessage;
        }
        return err;
    };
});

module.exports = OnoHttp;

/**
 * Make Oh No! HTTP!
 * @param code
 * @return {Function}
 * @constructor
 */
function OnoHttp(code) {
    if (!code || isNaN(+code)) {
        code = 500;
    }
    return httpErrors[code] || httpErrors[500];
}

function toIdentifier (str) {
    return str.split(' ').map(function (token, i) {
        var f = token.slice(0, 1);
        var pre = i ? f.toUpperCase() : f.toLowerCase();
        var pos = token.slice(1);
        return pre + pos;
    }).join('').replace(/[^ _0-9a-z]/gi, '');
}
