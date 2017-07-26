/**
 * @file u
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = function (app) {

    return function u(str, disabled) {
        if (disabled) {
            return str;
        }
        return encodeURIComponent(str);
    };

};
