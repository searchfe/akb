/**
 * @file static
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const send = require('send');
const resolve = require('../../util').resolve;

module.exports = function (app) {

    return async function assets(ctx) {
        let route = ctx.route;
        let options = route.options;

        // if target specified, use it
        let pathname = options.target ? options.target : ctx.path;

        // static file root
        options.root = resolve(app.config.appdir, options.root);

        return await new Promise((resolve, reject) => {
            send(ctx.req, pathname, options)
                .on('error', err => {
                    reject(err);
                })
                .on('headers', (req, path, stat) => {
                    // support setHeaders
                    if (options.setHeaders) {
                        options.setHeaders.call(undefined, ctx, path, stat);
                    }

                    ctx.status = 200;
                })
                .on('end', () => {
                    resolve();
                })
                .pipe(ctx.res);
        });
    };

};
