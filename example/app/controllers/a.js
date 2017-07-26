/**
 * @file a
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const testChangeFile = require('../../utils/testChangeFile');

module.exports = {
    async b(ctx) {
        ctx.body = await this.render('index', {name: 'sekiyika=?' + testChangeFile()});
    }
};
