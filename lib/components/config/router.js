/**
 * @file routes config
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

module.exports = {

    // 启用默认route
    enableDefaultRoutes: true,

    routes: {
        // '/assets/(.*)': {
        //     // 指定当前请求是否为静态文件请求
        //     type: 'static',
        //     // 如果指定了target，则会用target的作为响应文件的name
        //     // target: '/assets/{0}',
        //     // 指定该route对应的静态文件目录s
        //     dir: './public',
        //     // 以下配置参考 https://github.com/visionmedia/send#options
        //     // 是否需要使用etag
        //     etag: true,
        //     // max age
        //     maxAge: 1 * 365 * 24 * 3600 * 1000,
        //     // 类似于.bashrc这类的文件配置访问许可 deny allow ignore
        //     dotfiles: 'deny',
        //     extensions: false,
        //     index: false
        // },

        // // 重定向规则写法
        // '/test/redirect': {
        //     redirect: '/'
        // },

        // '/:controller/:action/(.*)': {
        //     target: '{controller}/{action}'
        //
        //     // 添加中间件，在action之前执行
        //     middlewares: [
        //         function (req, resp, next) {
        //             console.log('hello world');
        //             next();
        //         }
        //     ]
        // }
    }

};
