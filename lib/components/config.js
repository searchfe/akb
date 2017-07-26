/**
 * @file config
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const path = require('path');
const statSync = require('fs').statSync;

const _ = require('lodash');
const glob = require('glob');

/**
 * default config path
 *
 * @type {string}
 * @const
 */
const DEFAULT_PATH = path.join(__dirname, 'config');

/**
 * read and merge config
 *
 * @param {Application} app application instance
 * @return {Object}
 * @exports
 */
module.exports = function config(app) {

    let {appdir, configdir} = app;
    let exports = {appdir};

    // loda default config
    loadConfig(DEFAULT_PATH, exports);

    // load custom config
    loadConfig(configdir, exports);

    // update config according NODE_ENV
    updateConfigByEnv(process.env.NODE_ENV, exports);

    return exports;

    /**
     * load config according to specific dir
     *
     * @param {string} dir dir
     * @param {Object} config config
     */
    function loadConfig(dir, config) {
        if (!statSync(dir)) {
            return;
        }

        let files = glob.sync('**/*.js', {cwd: dir, root: '/'});

        files.forEach(filepath => {
            filepath = filepath.substring(0, filepath.length - 3);

            let paths = filepath.split('/');

            // create namespace
            let name;
            let cur = config;
            for (let i = 0; i < paths.length - 1; i++) {
                name = paths[i];
                if (!cur[name]) {
                    cur[name] = {};
                }

                cur = cur[name];
            }

            name = paths[paths.length - 1];
            let obj = require(path.join(dir, filepath));

            if (cur[name]) {
                _.merge(cur[name], obj);
            }
            else {
                cur[name] = obj;
            }
        });
    }

    /**
     * update config according env
     *
     * @param {string} env NODE_ENV，默认为production
     * @param {Object} config 配置
     */
    function updateConfigByEnv(env = 'production', config) {
        let temp = config.env || {};
        temp = temp[env];

        if (temp) {
            _.merge(config, temp);
        }
    }

};
