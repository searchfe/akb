/**
 * @file ral.js
 * @author pengxing (pengxing@baidu.com)
 * @description
 *  ral config
 */

module.exports = {

    // 默认为node-ral，用户可以在ral.js里更改为yog-ral，yog-ral在百度内部支持比较好，有mcpack
    // nshead等一些功能
    adapter: undefined,

    // 请求超时
    timeout: 3000,

    // 请求重试次数
    retry: 2,

    service: {
        PASSPORT: {
            protocol: 'http',
            unpack: 'string',
            encoding: 'utf-8',
            balance: 'random',
            server: [{
                host: 'www.baidu.com', port: 80
            }]
        }
    }

};
