/**
 * @file monitor
 * @author wangyisheng@baidu.com (wangyisheng)
 **/

'use strict';

let MonitorTransport = require('./transport');

/**
 * monitor
 *
 * @param {Akb} app akb对象
 * @return {Object}
 */
module.exports = function (app) {

    let {monitor: config, logger: logConfig, ral: ralConfig} = app.config;
    let monitorTransport;

    if (config.enable && logConfig.enable) {
        // 为log.config和ral.config添加必要配置项
        monitorTransport = new MonitorTransport({app, config});

        logConfig.overrideTransports = false;
        logConfig.transports.push(monitorTransport);
        logConfig.wfTransports.push(monitorTransport);

        ralConfig.service.AKB_MONITOR = {
            protocol: 'http',
            pack: 'querystring',
            unpack: 'string',
            encoding: 'utf-8',
            balance: 'random',
            server: [{
                host: config.host,
                port: +config.port
            }],
            path: config.path
        };
    }

    return {
        get config() {
            return config;
        },

        get transport() {
            return monitorTransport;
        }
    };
};
