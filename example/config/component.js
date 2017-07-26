/**
 * @file component.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

module.exports = {

    /**
     * 组件目录
     *
     * @type {string}
     */
    dir: './app/components',

    /**
     * 组件名称
     *
     * @type {Array.<string>}
     */
    components: [
        'redis',
        {
            name: 'db',
            filepath: './db/db.js'
        }
    ]

};
