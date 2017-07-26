/**
 * @file a middleware
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';
const testChangeFile = require('../../utils/testChangeFile');

module.exports = function a(app) {

    return async function (context, next) {
        console.log(testChangeFile(), '=> a middleware');
        context.data.push(await getData());
        console.log('a');
        await next();
        console.log('after a');
    };
};

function getData() {
    return new Promise((r, j) => {
        setTimeout(function () {
            r('a');
        }, 10);
    });
}
