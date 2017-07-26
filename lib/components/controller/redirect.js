/**
 * @file redirect
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = function (app) {

    return async function redirect(ctx) {
        let opts = ctx.route.options;
        if (opts && opts.redirect) {
            ctx.redirect(opts.redirect);
        }
        else {
            return ctx.throw('redirect target can\'t be empty.');
        }
    };

};
