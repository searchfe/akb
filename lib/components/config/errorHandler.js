/**
 * @file errorHandler
 * @author sekiyika (px.pengxing@gmail.com)
 */

'use strict';

module.exports = {

    /**
     * default error handler
     *
     * @type {string}
     */
    target: 'error/handle',

    /**
     * controller and action name for every status code
     *
     * ```
     * statusCode: {
     *     404: 'error/404',
     *     500: 'error/500'
     * }
     * ```
     *
     * @type {Object}
     */
    statusCode: {}

};
