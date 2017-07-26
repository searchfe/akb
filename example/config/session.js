/**
 * @file 配置session的存储方式，默认本地内存
 * @author huanguiquan(huanghuiquan@baidu.com)
 */


let sess = {};

module.exports = {

    // 是否启用session
    enable: true,

    /**
     * session store, default is memory store
     *
     * ```javascript
     *
     * {
     *     set(sid, session) {
     *         return new Promise();
     *     }
     *
     *     get(sid) {
     *         return new Promise();
     *     }
     * }
     * ```
     * @type {Object|undefined}
     */
    store: {
        async get(sid) {
            return await getData(sid);
        },
        async set(sid, session) {
            return await setData(sid, session);
        }
    },

    keys: ['a', 'b'],

    // koa.session的配置
    session: {
        secret: 'akb',
        key: 'NODE_SESSION_ID'
    }

};

function setData(sid, value) {
    return new Promise(resolve => {
        setTimeout(() => {
            sess[sid] = value;
            resolve();
        }, 10);
    });
}

function getData(sid) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(sess[sid]);
        }, 10);
    });
}
