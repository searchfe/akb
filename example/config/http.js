/**
 * @file http config
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

module.exports = {
    // 请求超时时间
    timeout: 30000,

    // 是否信任proxy
    trustProxy: true,

    // 给返回头都加上etag
    etag: false,

    controllerDir: './app/controllers',

    bodyParser: {},

    // jsonp的callback
    jsonpCallback: 'callback'
};
