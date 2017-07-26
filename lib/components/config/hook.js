/**
 * @file hook.js
 * @author sekiyika(pengxing@baidu.com)
 */

module.exports = {

    /**
     * hooks directory
     *
     * @type {string}
     */
    dir: './app/hooks',

    /**
     * hooks
     *
     * @type {Object}
     */
    hooks: {
        started: [],
        close: [],

        beforeRequest: [],
        afterResponse: [],

        beforeRender: [],
        afterRender: [],

        beforeRal: [],
        afterRal: []
    }

};
