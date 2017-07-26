/**
 * @file ral.js
 * @author pengxing (pengxing@baidu.com)
 */

/**
 * service config
 *
 * @see https://github.com/fex-team/node-ral/blob/master/README.md#创建配置
 * @typedef {Service}
 *
 * @property {string} protocol protocol
 * @property {string} pack pack
 * @property {string} unpack unpack
 * @property {string} encoding encoding, default utf-8
 * @property {string} balance balance, default roundrobin
 * @property {number} timeout timeout
 * @property {number} retry retry times
 * @property {string} method request method
 * @property {Object} query global queries
 * @property {string} path path
 * @property {Object} headers global headers
 * @property {Array.<Object.<string, string>>} server server list
 */

module.exports = {

    /**
     * 默认为node-ral，用户可以在ral.js里更改为yog-ral，yog-ral在百度内部支持比较好，有mcpack
     *
     * ```
     * engine: require('node-ral')
     * ```
     *
     * @type {Object} should be yog-ral or node-ral
     */
    engine: undefined,

    /**
     * timeout
     *
     * @type {number}
     */
    timeout: 3000,

    // 请求重试次数
    /**
     * retry times
     *
     * @type {number}
     */
    retry: 2,

    /**
     * service
     *
     * @type {Object.<string, Service>}
     */
    service: {}

};
