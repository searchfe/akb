/**
 * @file render middleware
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

module.exports = function (app) {
    return async function render(context, next) {
        await next();
    };
};
