/**
 * @file index.js
 * @author sekiyika (px.pengxing@gmail.com)
 * @author clarkt (tanglei02@baidu.com) es6 overwrite
 */

'use strict';

const nodeRal = require('node-ral');
const resolve = require('../util').resolve;

module.exports = function (app) {
    let config = app.config.ral;
    let engine = config.engine || nodeRal;
    let {RAL, RALPromise, Config: RALConfig} = engine;

    // init ral logger
    RAL.init({
        logger: {
            /* eslint-disable */
            log_path: resolve(app.appdir, app.config.logger.dir),
            /* eslint-enable */
            app: 'ral'
        }
    });

    // load config
    RALConfig.loadRawConf(Object.assign({}, config.service, app.config.service));

    /**
     * ral
     *
     * @param {string} service service name
     * @param {Object=} options ral options
     * @return {Promise} resolve response data, reject error
     */
    return async function (service, options = {}) {
        await app.hook('beforeRal', {service, options});

        let conf = config.service[service];
        options.timeout = typeof conf.timeout === 'number' ? conf.timeout : config.timeout;
        options.retry = typeof conf.retry === 'number' ? conf.retry : config.retry;

        /* eslint-disable babel/new-cap */
        return await RALPromise(service, options)
            .then(data =>
                app
                    .hook('afterRal', {service, options, data})
                    .then(() => Promise.resolve(data))
                    .catch(error => Promise.reject(error))
            )
            .catch(error =>
                app
                    .hook('afterRal', {service, options, error})
                    .then(() => Promise.reject(error))
                    .catch(err => Promise.reject(err))
            );
        /* eslint-enable babel/new-cap */
    };
};
