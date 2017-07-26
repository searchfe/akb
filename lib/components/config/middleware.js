/**
 * @file middleware.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = {

    /**
     * the dir of all middlewares
     *
     * @type {string}
     */
    'dir': './app/middlewares',

    /**
     * all requests will pass through these middlewares.
     *
     * @type {Array.<string>}
     */
    'all': [],

    /**
     * only dynamic requests will pass through these middlewares.
     *
     * @type {Array.<string>}
     */
    'dynamic': [],

    /**
     * only static requests will pass through these middlewares.
     *
     * @type {Array.<string>}
     */
    'static': []

};
