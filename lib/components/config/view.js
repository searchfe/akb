/**
 * @file view.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = {

    /**
     * render engine, developer can custom render engine, which default is etpl
     *
     * ```javascript
     * function (app) {
     *     function fn(path, options) {return new Promise();}
     *     fn.addFilter = function () {};
     *
     *     return fn;
     * }
     *
     * ```
     *
     * @type {Function}
     */
    engine: undefined,

    /**
     * the directory of templates
     *
     * @type {string}
     */
    templateDir: './views',

    /**
     * the directory of filters
     *
     */
    filterDir: './app/filters',

    /**
     * if cache compiled template
     *
     * @type {boolean}
     */
    cacheable: true,

    /**
     * extension of templates
     *
     * @type {string}
     */
    ext: '.tpl',

    /**
     * the list of enabled filters
     *
     * here is an example of filter
     *
     * file: encodeHTML.js
     * ```javascript
     * export default function (app) {
     *     return function encodeHTML(...args) {};
     * }
     * ```
     *
     * @type {Array.<string>}
     */
    filters: [],

    /**
     * options for engine, default for etpl
     *
     * @type {Object}
     * @property {string} options.commandOpen etpl option
     * @property {string} options.commandClose etpl option
     * @property {boolean} options.strip etpl option
     */
    options: {
        commandOpen: '{{',
        commandClose: '}}',
        strip: true
    }

};
