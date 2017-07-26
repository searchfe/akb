/**
 * @file logger.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = {

    /**
     * logger engine, developer can custom logger engine, which default is winston.
     *
     * ```javascript
     * function (app) {
     *     return {
     *         debug(){...},
     *         info(){...},
     *         warn(){...},
     *         fatal(){...}
     *     };
     * }
     *
     * ```
     *
     * @type {Function|undefined}
     */
    engine: undefined,

    /**
     * enable logger or disable
     *
     * @type {boolean}
     */
    enable: false,

    /**
     * dir of saved logs, default is ${appdir}/logs
     *
     * @type {string}
     */
    dir: './logs',

    /**
     * if logger should print out the line number of invoking code
     *
     * @type {Object}
     */
    lineno: {
        warn: true,
        fatal: true
    },

    /**
     * debug info warn fatal
     *
     * @type {string}
     */
    level: 'info',

    /**
     * default size of single log file 4GB
     *
     * @type {number}
     */
    maxsize: 4 * 1024 * 1024 * 1024 * 1024,

    /**
     * auto ratote pattern
     *
     * @type {string}
     */
    dailyRotatePattern: '.yyyy-MM-dd',

    /**
     * override default transports or not
     *
     * default to override systemic transport, set false to switch to append mode
     *
     * @type {boolean}
     */
    overrideTransports: true,

    /**
     * transports of debug and info.
     *
     * file transport is default, and console transport will be added under debug
     * developer can add custom transport here
     *
     * @type {Array.<winston.transports.Transport>}
     */
    transports: [],

    /**
     * transports of warn and fatal
     *
     * file transport is default, and console transport will be added under debug
     * developer can add custom transport here
     *
     * @type {Array.<winston.transports.Transport>}
     */
    wfTransports: []

};
