/**
 * @file hook.js
 * @author sekiyika(pengxing@baidu.com)
 */

module.exports = {

    dir: './app/hooks',

    hooks: {
        started: ['started'],

        beforeRequest: [],
        afterResponse: [],

        beforeRender: [],
        afterRender: [],

        beforeRal: [],
        afterRal: []
    }

};
