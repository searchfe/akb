/**
 * @file error.js
 * @author qiusiqi (qiusiqi@baidu.com)
 */

'use strict';

/* global module */
module.exports = {

    async 404(ctx) {
        console.log('action 404');
        ctx.body = await this.render('error', {error: ctx.error.message});
    },

    async 500(ctx) {
        console.log('action 500');
        ctx.body = await this.render('error', {error: ctx.error.message});
    }

};
