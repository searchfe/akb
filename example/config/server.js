/**
 * @file server
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

module.exports = {

    /**
     * server port
     *
     * @type {number}
     */
    port: 8849,

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
        enable: false,

        max: 2
    }

};
