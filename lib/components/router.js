/**
 * @file router
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

const pathToRegexp = require('path-to-regexp');
const formater = require('../util').formater;

/**
 * A match route info
 *
 * @typedef {Object} Route
 * @property {RouteOptions} options 路由配置的参数表
 * @property {Object} params url匹配到的参数
 * @property {string} type 请求的类型 请求类型，static或dynamic
 */

/**
 * 路由配置的参数表
 *
 * @typedef {Object} RouteOptions
 * @property {?function} middleware 中间件
 * @property {?string} module 模块名称
 * @property {?string} type 请求的类型 请求类型，static或dynamic
 * @property {?string} redirect 重定向路径
 * @property {Array} allowedMethods 允许的请求方法
 * @property {Object} allowedMethodsMap 允许的请求方法map
 */

/**
 * all methods
 *
 * @type {Array}
 */
const methods = ['get', 'head', 'post', 'put', 'delete', 'trace', 'options', 'connect', 'patch'];

/**
 * 默认路由配置
 *
 * @type {Object.<string, string>}
 */
const defaultRoutes = {'/*': '{0}'};

module.exports = function router(app) {

    let config = app.config.router;
    let {enableDefaultRoutes, routes: routesMap} = config;
    let routes;

    /**
     * 将路由规则编译为正则表达式
     *
     * @param  {string} rule url rule
     * @param {Object|string|Function} options options
     * @return {Object} 规则对象
     */
    function compile(rule, options) {
        // 兼容如下写法
        // 'GET /:pattern': app => async (context, next) => (this.body = 'test');
        if (typeof options === 'function') {
            options = {
                middleware: options
            };
        }

        // 'GET /:pattern': '{pattern}'
        if (typeof options === 'string') {
            options = {
                target: options
            };
        }

        options = options || {};

        // 先初始化middlewares
        if (typeof options.middleware === 'function') {
            options.middleware = options.middleware(app);
        }

        let segments = String(rule).trim().split(/\s+/g);
        let pattern = segments.pop();

        options.allowedMethods = segments.length
            ? segments.map(method => String(method).toLowerCase())
            : methods;

        // array => map
        options.allowedMethodsMap = options.allowedMethods.reduce((obj, method) => {
            obj[method] = true;
            return obj;
        }, {});

        return {
            regexp: pathToRegexp(pattern),
            options: options
        };
    }

    routes = Object.keys(routesMap).map(key => compile(key, routesMap[key]));

    if (enableDefaultRoutes) {
        // 开启默认路由
        routes = [...routes, ...Object.keys(defaultRoutes).map(key => compile(key, defaultRoutes[key]))];
    }

    return {

        /**
         * 通过pathname获取路由信息
         *
         * @param {string} method 请求的方法
         * @param  {string} pathname 路径
         * @return {Route|null} 路由信息
         */
        match(method, pathname) {
            method = String(method).toLowerCase();

            for (let rule of routes) {

                // 优先匹配method, 如果method不匹配，直接执行下一个规则匹配
                if (!rule.options.allowedMethodsMap[method]) {
                    continue;
                }

                let regexp = rule.regexp;
                let matches = regexp.exec(pathname);
                let matchRoute = {};
                let keys = regexp.keys;
                let params = {};
                let options = Object.assign({}, rule.options);

                if (matches) {
                    for (let i = 0, len = keys.length; i < len; i++) {
                        params[keys[i].name] = matches[i + 1];
                    }

                    matchRoute.params = params;
                    matchRoute.options = options;
                    matchRoute.type = options.type = options.type || 'dynamic';

                    // 将配置中的占位符替换
                    for (let key of Object.keys(options)) {
                        let value = options[key];
                        if (typeof value === 'string') {
                            options[key] = formater(value, params);
                        }
                    }

                    if (options.redirect) {
                        matchRoute.redirect = options.redirect;
                    }

                    return matchRoute;
                }
            }
            return null;
        }
    };
};
