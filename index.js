/**
 * @file index
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const Akb = require('./lib/akb');

/**
 * 实例化akb对象
 *
 * @param {Object} options 初始化参数
 * @param {string} options.appdir 初始项目目录
 * @param {string} options.configdir 配置目录
 * @return {Akb}
 */
function akb(options) {
    // 把 app 对象挂在globals上，方便使用
    return global.akb = new Akb(options);
}

akb.Akb = Akb;

module.exports = akb;
