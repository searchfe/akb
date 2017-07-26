/**
 * @file index.js
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

const extendsContext = require('./extends/context');
const join = require('path').join;
const compose = require('koa-compose');

const isArray = Array.isArray;
const defaultMiddlewares = ['init', 'bodyParser', 'session'];
const defaultDir = join(__dirname, 'defaults');

let registered = false;
let fns;

module.exports = function (app) {

    const {config, appdir} = app;
    const dir = join(appdir, config.middleware.dir);
    const {
        all = [],
        dynamic = [],
        static: statics = []
    } = config.middleware;

    fns = [];

    // extend context
    extendsContext(app);

    // default middlewares
    loadMiddlewareByName(defaultMiddlewares, defaultDir).forEach(middleware => use(middleware, 'all'));

    // config middlewares
    loadMiddlewareByName(all, dir).forEach(middleware => use(middleware, 'all'));
    loadMiddlewareByName(dynamic, dir).forEach(middleware => use(middleware, 'dynamic'));
    loadMiddlewareByName(statics, dir).forEach(middleware => use(middleware, 'static'));

    // handler middleware
    use(loadMiddlewareByName('handler', defaultDir), 'all');

    if (!registered) {
        app.use(async (ctx, next) => {
            await compose(fns)(ctx, next);
        });
        registered = true;
    }

    /**
     * 使用middleware
     *
     * @param  {Function} middleware akb middleware
     * @param  {string} type middleware类型
     */
    function use(middleware, type) {
        if (!middleware) {
            return;
        }

        let fn = isArray(middleware) ? parallel(middleware.map(mw => mw(app))) : middleware(app);

        if (!isValidMiddleware(fn)) {
            return;
        }

        fns.push(async function akbMiddleware(ctx, next) {

            // 如果连接已关闭, 停止继续执行middleware
            if (ctx.socket.destroyed) {
                return;
            }

            let requestType = ctx.route && ctx.route.type;

            // 根据请求类型分配middleware
            if (type && type !== 'all' && requestType !== type) {
                return await next();
            }

            try {
                // 串行执行middleware
                await fn.call(ctx, ctx, next);
            }
            catch (e) {
                ctx.throw(500, e);
            }
        });
    }

    /**
     * 将并行执行的middlewares合并成单个middleware
     *
     * @param  {Array.<Function>} fns 并行执行的middlewares
     * @return {Function} middleware
     */
    function parallel(fns) {
        fns = fns.filter(isValidMiddleware);

        if (fns.length < 2) {
            return fns[0];
        }

        return async function (ctx, next) {
            let delays = [];
            let promisesEnd = [];
            // next之前的promise
            let promises = fns.map(subFn => new Promise(r => promisesEnd.push(
                // middleware执行返回promise
                subFn.call(ctx, ctx, () => {
                    // middleware内部的next的前半部分任务完成
                    r();
                    // 返回一个promise后交出控制权
                    return new Promise(r => delays.push(r));
                }
            ))));
            // 等待next前半部分任务完成
            await Promise.all(promises);
            // 控制权交个下一个中间件
            await next();
            // 执行next后半部分
            delays.forEach(delayFn => delayFn());
            // 等待后半部分执行结果
            await Promise.all(promisesEnd);
        };
    }
};

/**
 * 通过middleware名称动态加载middleware
 *
 * @param  {string|Array.<string>} name 名称或名称集合
 * @param  {string} dir  middleware所在目录的绝对路径
 *
 * @return {Function|Array.<Function>} 对应的middleware或middleware数组
 * @private
 */
function loadMiddlewareByName(name, dir) {
    if (isArray(name)) {
        return name.map(sname => loadMiddlewareByName(sname, dir));
    }

    // 动态require模块
    let middleware = require(join(dir, name));

    // 支持es6 module的写法
    if (typeof middleware === 'object') {
        middleware = middleware.default;
    }

    if (typeof middleware !== 'function') {
        throw new Error('Middleware must be a function.');
    }

    return middleware;
}

function isValidMiddleware(fn) {
    return typeof fn === 'function';
}

