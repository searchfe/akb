/**
 * @file init middleware
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

module.exports = function init(app) {
    return async (ctx, next) => {
        ctx.data = ['init'];
        await next();
    };
};
