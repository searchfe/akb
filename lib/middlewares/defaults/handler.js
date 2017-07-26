/**
 * @file handler
 * @author huanghuiquan(huanghuiquan@baidu.com)
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = function (app) {

    let ctl = app.controller;

    return async function handler(ctx, next) {
        let route = ctx.route;

        // not found
        if (!route) {
            return ctx.throw(404);
        }

        await ctl.execute(ctx, next);
    };
};
