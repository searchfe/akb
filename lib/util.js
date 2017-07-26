/**
 * @file util
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const path = require('path');

/**
 * if filepath is absolute, return true, or return false
 *
 * @param {string} path file path
 * @return {boolean}
 */
exports.isAbsolute = function (path) {
    if (!path) {
        return false;
    }
    if ('/' === path[0]) {
        return true;
    }
    if (':' === path[1] && '\\' === path[2]) {
        return true;
    }
    if ('\\\\' === path.substring(0, 2)) {
        return true; // Microsoft Azure absolute path
    }
    return false;
};

/**
 * resolve the pathname
 *
 * @param {string} root root path
 * @param {string} pathname path name
 * @return {string}
 */
exports.resolve = function (root, pathname) {
    if (exports.isAbsolute(pathname)) {
        return pathname;
    }

    return path.resolve(root, pathname);
};

/**
 * 简易模板处理
 *
 * '{a}' + {a: 1} => '1'
 *
 * @param {string} str  原字符串
 * @param {Object} data 数据
 * @return {string} 替换后的字符串
 */
exports.formater = function (str, data) {
    return str.replace(/\{(.*?)\}/g, (m, p) => data[p]);
};

/**
 * encode HTML
 *
 * @param {string} html the html to be encoded
 * @return {string}
 */
exports.encodeHTML = function (html) {
    return String(html)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};
