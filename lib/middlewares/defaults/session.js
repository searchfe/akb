/**
 * @file session middleware
 * @author tanglei(tanglei02@baidu.com)
 */

'use strict';

/* eslint-disable fecs-prefer-async-await */
const co = require('co');
const GenericSession = require('koa-generic-session');

module.exports = function (app) {
    if (!app.config.session.enable) {
        return async (ctx, next) => {
            await next();
        };
    }

    /* eslint-disable babel/new-cap */
    let session = GenericSession(app.session.config);

    /* eslint-enable babel/new-cap */
    return async (ctx, next) => {
        await co(session.call(ctx, function* () {
            yield next();
        }));
    };
};
/* eslint-enable fecs-prefer-async-await */
