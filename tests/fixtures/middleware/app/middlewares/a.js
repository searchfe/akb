/**
 * @file a middleware
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

module.exports = function a(app) {
    return async function (ctx, next) {
        ctx.data.push('a');
        await next();
    };
};
