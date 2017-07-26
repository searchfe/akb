/**
 * @file init middleware
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

function b(app) {
    return async function b(ctx, next) {
        ctx.data.push(getData);
        await next();
    };
}

function getData() {
    return new Promise((r, j) => {
        setTimeout(function () {
            r('async data b');
        }, 10);
    });
}

module.exports = b;
