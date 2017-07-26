/**
 * @file task.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = async function (app) {

    await new Promise(resolve => setTimeout(resolve, 1000));

    return async function () {
        console.log(new Date());
    };

};
