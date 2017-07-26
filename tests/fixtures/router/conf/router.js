/**
 * @file routes config
 * @author sekiyika(px.pengxing@gmail.com)
 */

'use strict';

module.exports = {

    enableDefaultRoutes: true,

    routes: {
        '/': function (app) {
            return function (ctx) {
                ctx.body = ctx.data.join('|');
            };
        },

        'GET /testMethod': 'a/b',
        'POST /testMethod': 'a/c',
        'POST GET /testMutilMethod': 'a/c'
    }

};
