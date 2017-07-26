/**
 * @file session.js
 * @author sekiyika (px.pengxing@gmail.com)
 */

'use strict';

module.exports = {

    // 是否启用session
    enable: false,

    /**
     * session store, default is memory store
     *
     * ```javascript
     *
     * {
     *     set(sid, session, ttl) {
     *         return new Promise();
     *     },
     *
     *     get(sid) {
     *         return new Promise();
     *     },
     *
     *     destroy(sid) {
     *         return new Promise();
     *     }
     * }
     * ```
     * @type {Object|undefined}
     */
    store: null,

    keys: null,

    // @see https://github.com/koajs/generic-session#options
    session: {
        prefix: 'koa:sess:',
        key: 'NODE_SESSION_ID'
    }

};
