/**
 * @file index.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const redirectGenerator = require('./redirect');
const assetsGenerator = require('./static');
const dynamicGenerator = require('./dynamic');
const errorGenerator = require('./error');

module.exports = function (app) {

    const redirect = redirectGenerator(app);
    const assets = assetsGenerator(app);
    const dynamic = dynamicGenerator(app);
    const errorHandler = errorGenerator(app);

    return {

        /**
         * error handler
         *
         * @param {Error} error error
         * @param {Context} ctx context
         */
        async errorHandler(error, ctx) {
            await errorHandler.call(ctx, ctx, error);
        },

        /**
         * execute controller
         *
         * @param {Context} ctx context
         * @param {Function} next nexts
         */
        async execute(ctx, next) {
            let route = ctx.route;
            let ctl;

            // redirect
            if (route.redirect) {
                ctl = redirect;
            }
            else {
                // Static resources
                if (route.type === 'static') {
                    ctl = assets;
                }

                // Dynamic controller
                if (route.type === 'dynamic') {
                    ctl = dynamic;
                }
            }

            let options = route.options || {};
            if (options.middleware) {
                // execute the middleware from config
                await options.middleware.call(ctx, ctx, async () => {
                    await ctl.call(ctx, ctx);
                    await next();
                });
            }
            else {
                await ctl.call(ctx, ctx);
                await next();
            }
        }

    };

};
