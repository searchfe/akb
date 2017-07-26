/**
 * @file bodyparser
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

const parser = require('koa-bodyparser');

module.exports = function (app) {

    const options = app.config.http.bodyParser;
    if (options === false) {
        return;
    }

    return parser(options);
};
