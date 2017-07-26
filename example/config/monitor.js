/**
 * @file monitor config
 * @author wangyisheng@baidu.com (wangyisheng)
 **/

'use strict';

module.exports = {

    /**
     * enable monitor, enabled default
     *
     * @type {Boolean}
     */
    enable: true,

    /**
     * akb-monitor ip
     *
     * @type {String}
     */
    host: '127.0.0.1',

    idc: process.env.IDC || 'offline',

    sendInterval: 10000

};
