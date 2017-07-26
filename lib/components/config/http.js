/**
 * @file http config
 * @author huanghuiquan(huanghuiquan@baidu.com)
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';


module.exports = {

    /**
     * timeout of every requests
     *
     * @type {boolean}
     */
    timeout: 30000,

    /**
     * directory of controller
     *
     * @type {string}
     */
    controllerDir: './app/controllers',

    /**
     * jsonp callback name
     *
     * @type {string}
     */
    jsonpCallback: 'callback',

    /**
     * config of body parser. set `bodyParser: false` can disable `bodyParser`
     *
     * see `https://github.com/koajs/bodyparser` for more options.
     *
     * @type {Object}
     */
    bodyParser: {
        enableTypes: ['json', 'form'],
        encode: 'utf-8',
        formLimit: '56kb',
        jsonLimit: '1mb',
        textLimit: '1mb',
        strict: true,
        detectJSON: null
    }

};
