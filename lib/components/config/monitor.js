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
     * service IDC
     *
     * @type {String}
     */
    idc: 'unknown',

    /**
     * akb-monitor ip
     *
     * @type {String}
     */
    host: '10.58.173.21',

    /**
     * akb-monitor port
     *
     * @type {String}
     */
    port: '8301',

    /**
     * akb-monitor path
     *
     * @type {String}
     */
    path: '/api/receive',

    /**
     * send interval (ms)
     *
     * @type {Number}
     */
    sendInterval: 30000
};
