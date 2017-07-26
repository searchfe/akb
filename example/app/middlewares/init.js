/**
 * @file init middleware
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

module.exports = function (app) {
    return async function init(context, next) {
        console.log('init');
        context.data = ['init'];
        await next();
    };
};
