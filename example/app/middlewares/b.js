/**
 * @file init middleware
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

const testChangeFile = require('../../utils/testChangeFile');

function b(app) {
    return async function b(context, next) {
        console.log(testChangeFile(), '=> b middleware');
        context.data.push('b');
        console.log('b');
        await next();
        console.log('after b');
    };
}

module.exports = b;
