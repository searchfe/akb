/**
 * @file hook
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const compose = require('koa-compose');
const path = require('path');
const util = require('../util');

/**
 * 这里和akb对象原本的EventEmitter分开是方便管理，不搅和在一块
 *
 * @param {Akb} app akb instance
 * @return {Function}
 */
module.exports = async function (app) {

    let {dir: hookDir, hooks} = app.config.hook;

    // 将 hookDir 变成绝对地址
    hookDir = util.resolve(app.appdir, hookDir);

    /**
     * hook store
     *
     * @type {Map}
     */
    let hookStore = new Map();

    /**
     * execute hooks
     *
     * @param {string} name hook name
     * @param {Object} params params
     * @return {Promise}
     */
    async function hook(name, params) {
        let hooks = hookStore.get(name);

        if (!hooks) {
            app.logger.warn(`hooks '${name}' doesn't exist`);
            return Promise.resolve();
        }

        if (!hooks.length) {
            return Promise.resolve();
        }

        // 将 hooks 变成类似于 middleware 的调用串
        await compose(hooks)(params);
    }

    /**
     * reload hooks
     */
    hook.reload = async function () {
        hook.dispose();

        for (let key of Object.keys(hooks)) {
            let events = hooks[key];
            let items = [];
            hookStore.set(key, items);

            for (let name of events) {
                let fn = require(path.join(hookDir, name))(app);
                // 如果是 async 的函数，则等待
                if (fn instanceof Promise) {
                    fn = await fn;
                }

                items.push(fn);
            }
        }
    };

    /**
     * dispose all hooks
     */
    hook.dispose = function () {
        hookStore.clear();
    };

    await hook.reload();

    return hook;
};
