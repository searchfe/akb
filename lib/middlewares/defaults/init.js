/**
 * @file init middleware
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

module.exports = function (app) {

    return async function init(ctx, next) {

        await app.hook('beforeRequest', {ctx});

        // 传递到模板中的参数
        ctx.locals = {};

        // override app
        ctx.app = ctx.request.app = ctx.response.app = app;

        // route
        ctx.route = app.router.match(ctx.method, ctx.path);

        await next();

        await app.hook('afterResponse', {ctx});
    };
};
