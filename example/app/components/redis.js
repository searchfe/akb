/**
 * @file redis.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = async function (app) {

    await new Promise(resolve => {
        setTimeout(resolve, 2000);
    });

    return {
        get() {
            console.log('redis get');
        }
    };

};
