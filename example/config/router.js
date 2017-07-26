/**
 * @file routes config
 * @author sekiyika(px.pengxing@gmail.com)
 */

'use strict';

module.exports = {

    enableDefaultRoutes: true,

    routes: {

        '/': 'a/b',

        '/api/:module/:action': '{module}/api/{action}',

        '/test/postMethod': {
            target: 'test/postMethod',
            middleware(app) {
                return async(ctx, next) => {
                    console.log(ctx.request.body);
                    await ctx.json(ctx.request.body);
                };
            }
        },

        'GET /test/getMethod': {
            target: 'test/getMethod',
            middleware(app) {
                return async function (ctx, next) {
                    let params = ctx.params;
                    params.name = 'huanghuiquan';

                    this.body = await ctx.render('index', {name: ctx.param('name')});
                };
            }
        },

        // 错误页
        '/error/:action': 'error/{action}',

        // 静态文件
        '/assets/(.*)': {
            type: 'static',
            target: '/assets/{0}',
            root: './public',
            // max age
            maxAge: 1 * 365 * 24 * 3600 * 1000,
            index: false,
            dotfiles: 'deny',
            lastModified: true,
            etag: false,
            setHeaders(ctx, path, stat) {
                console.log(path);
                ctx.set('name', 'pengxing');
            }
        },

        '/test/redirect': {
            redirect: '/',
            middleware(app) {
                return async(ctx, next) => {
                    app.logger.info('1');
                    await next();
                };
            }
        },

        ['/monitor'](app) {
            return async context => {
                console.log('function options');
                context.body = 'status 200';
            };
        },

        '/favicon.ico': {
            type: 'static',
            target: '/static/src/img/favicon.ico',
            root: './public',
            maxAge: 1 * 365 * 24 * 3600 * 1000
        }

    }

};


