/**
 * @file server config
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

const os = require('os');

module.exports = {

    /**
     * the host listen to
     *
     * @type {string}
     */
    host: '0.0.0.0',

    /**
     * server port
     *
     * @type {number}
     */
    port: 8849,

    /**
     * trust proxy or not, default true
     *
     * @type {boolean}
     */
    proxy: true,

    /**
     * Subdomains are the dot-separated parts of the host before the main domain
     * of the app. By default, the domain of the app is assumed to be the last two
     * parts of the host. This can be changed by setting `subdomainOffset`.
     *
     * For example, if the domain is "tobi.ferrets.example.com":
     * If `subdomainOffset` is not set, `context.subdomains` is
     * `["ferrets", "tobi"]`.
     * If `subdomainOffset` is 3, `context.subdomains` is `["tobi"]`.
     *
     * @type {number}
     */
    subdomainOffset: 2,


    /**
     * config for cluster
     *
     * @type {Object}
     */
    cluster: {

        /**
         * enable cluster, enabled default
         *
         * @type {Boolean}
         */
        enable: true,

        /**
         * count of processes
         *
         * @type {number}
         */
        max: os.cpus().length
    }

};
