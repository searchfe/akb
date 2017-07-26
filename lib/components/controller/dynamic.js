/**
 * @file dynamic
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const path = require('path');
const glob = require('glob');
const resolve = require('../../util').resolve;

/* eslint-disable fecs-valid-var-jsdoc, fecs-prefer-destructure */
module.exports = function (app) {

    /**
     * http config
     *
     * @type {Object}
     */
    let config = app.config.http;

    /**
     * store that save target and actions
     *
     * @type {Map}
     */
    let store = new Map();

    /**
     * controller directory
     *
     * @type {string}
     */
    let controllerDir = resolve(app.appdir, config.controllerDir);

    /**
     * action cacheable
     *
     * @type {boolean}
     */
    let enableHotReload = app.config.globals.enableHotReload;

    /**
     * action files tree
     *
     * @type {Object}
     */
    let tree;

    /**
     * find the corresponding action, and run
     *
     * @param {Context} ctx context instance
     * @param {Array.<*>} params 其他参数
     */
    return async function dynamic(ctx, ...params) {
        let options = ctx.route.options;
        let target = options.target;

        let fn;

        // 如果启用了 hot reload 或者当前还没有初始化，则 build 这棵树
        if (!enableHotReload || !tree) {
            tree = buildTree(await scan());
        }

        if (!enableHotReload && store.has(target)) {
            fn = store.get(target);
        }
        else {
            let fns = getAction(target, tree);
            if (fns) {
                fn = wrap(fns);
            }

            // save controller instance to store
            if (!enableHotReload) {
                store.set(target, fn);
            }
        }

        // run action
        if (fn) {
            fn && await fn.call(ctx, ctx, ...params);
        }
        else {
            ctx.throw(404);
        }
    };

    /**
     * scan controllerDir, return all js files
     *
     * @return {Promise}
     */
    async function scan() {
        return new Promise((resolve, reject) => {
            glob('**/*.js', {cwd: controllerDir, root: controllerDir}, (err, files) => {
                if (err) {
                    return reject(err);
                }

                resolve(files);
            });
        });
    }

    /**
     * build file tree
     *
     * @param {Array.<string>} files files
     * @return {Object}
     */
    function buildTree(files) {
        let tree = {};

        files.forEach(filepath => {
            let basename = path.basename(filepath);
            let dirname = path.dirname(filepath);

            // 去除掉 . 的影响
            let dirs = dirname === '.' ? [] : dirname.split('/');
            let curr = tree;

            dirs.forEach(dir => {
                if (!curr[dir]) {
                    curr[dir] = {};
                }

                curr = curr[dir];
            });

            curr[basename] = true;
        });

        return tree;
    }


    /**
     * get action and filters
     *
     * @param {string} target target
     * @param {Object} tree file tree
     * @return {Array.<Function>|undefined}
     */
    function getAction(target, tree) {
        if (!target || !tree) {
            return;
        }

        let arr = target.split('/');
        let curr = tree;

        let before = [];
        let after = [];
        let action;

        let visited = [];

        for (let i = 0, l = arr.length; i < l; i++) {
            let dir = arr[i];

            // target 路径中不允许出现 protected
            if (dir === 'protected') {
                throw new Error('target can\'t contain directory "protected"');
            }

            // 添加 before 和 after
            let protect = curr.protected;
            if (protect) {
                if (protect['before.js']) {
                    before.push(req('protected/before.js'));
                }
                if (protect['after.js']) {
                    after.unshift(req('protected/after.js'));
                }
            }

            if (i > l - 3) {
                let filename = dir + '.js';
                if (curr[filename]) {
                    let fn;
                    // 处理目录的情况
                    if (i === l - 2) {
                        fn = req(filename)[arr[i + 1]];
                    }
                    else if (i === l - 1) {
                        fn = req(filename);
                    }

                    if (fn && typeof fn === 'function') {
                        action = fn;
                        break;
                    }
                }
            }

            visited.push(dir);
            curr = curr[dir];

            if (!curr) {
                return;
            }
        }

        if (action) {
            return [...before, action, ...after];
        }

        /**
         * require by filename
         *
         * @param {string} filename filename
         * @return {*}
         */
        function req(filename) {
            let filepath = path.join(controllerDir, ...visited, filename);

            if (enableHotReload && require.cache[filepath]) {
                require.cache[filepath] = null;
            }

            return require(filepath);
        }
    }

    /**
     * wrap before, action, after as a function
     *
     * @param {Array.<Function>} fns functions
     * @return {Function}
     */
    function wrap(fns) {
        return async function (ctx, ...params) {
            for (let i = 0, l = fns.length; i < l; i++) {
                await fns[i].call(this, ctx, ...params);
            }
        };
    }
};
/* eslint-enable fecs-valid-var-jsdoc, fecs-prefer-destructure */
