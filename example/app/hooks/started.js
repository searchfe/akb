/**
 * @file started.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = function (app) {

    return async function (params, next) {
        app.logger.info('started');
        await next();
    };

};
