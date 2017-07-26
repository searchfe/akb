/**
 * @file c
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const testChangeFile = require('../../../utils/testChangeFile');

module.exports = async function (ctx) {

    ctx.app.redis.get();
    ctx.app.db.get();

    ctx.jsonp({
        name: 'pengxing' + testChangeFile()
    });
};
