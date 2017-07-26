/**
 * @file etpl.js
 * @author sekiyika (px.pengxing@gmail.com)
 */

'use strict';

const fs = require('fs');
const glob = require('glob');

const etpl = require('etpl');

const resolve = require('../../util').resolve;

module.exports = function (app) {
    let config = app.config.view;
    let file2nameMap = {};
    let templateDir = resolve(app.config.appdir, config.templateDir);
    let engine = new etpl.Engine();

    // init engine
    initEngine(engine);


    /**
     * render template, or return renderer function
     *
     * @param {string} file filepath
     * @param {Object|undefined} data data
     * @return {Promise.<Function|string, Error>}
     */
    function tpl(file, data) {

        return new Promise(async (resolve, reject) => {
            let target;
            try {
                target = await getTarget(file);
            }
            catch (error) {
                reject(error);
                return;
            }

            if (!config.cacheable) {
                engine = new etpl.Engine();
                Object.keys(app.view.filterStore).forEach(name => {
                    engine.addFilter(name, app.view.filterStore[name]);
                });

                initEngine(engine);
            }

            let renderer = engine.getRenderer(target);
            if (!renderer) {
                reject(new Error(`template "${target}" not found`));
                return;
            }

            if (!data) {
                resolve(renderer);
                return;
            }

            try {
                resolve(renderer(data));
            }
            catch (error) {
                reject(error);
            }
        });
    }

    /**
     * add filter
     *
     * @param {string} name filter name
     * @param {Function} filter filter function
     */
    tpl.addFilter = function (name, filter) {
        engine.addFilter(name, filter);
    };

    return tpl;

    /**
     * init engine
     *
     * @param {Function} engine engine instance
     */
    function initEngine(engine) {
        engine.config(config.options);

        let files = glob.sync(`**/*${config.ext}`, {
            cwd: templateDir,
            root: templateDir
        });

        files.forEach(file => {
            file = resolve(templateDir, file);
            engine.compile(fs.readFileSync(file, 'utf-8'));
        });
    }

    /**
     * get target name of template
     *
     * @param {string} file file content
     * @return {Promise.<string, Error>}
     */
    function getTarget(file) {
        return new Promise((resolve, reject) => {
            if (config.cacheable) {
                if (file2nameMap[file]) {
                    resolve(file2nameMap[file]);
                    return;
                }
            }

            fs.readFile(file, 'utf-8', (error, content) => {
                if (error) {
                    reject(error);
                    return;
                }
                /* jshint ignore:start */
                if (!/\s*target:\s*([a-z0-9\/_-]+)\s*(\(\s*master\s*=\s*([a-z0-9\/_-]+)\s*\))?\s*/i.test(content)) {
                    reject(new Error(`Invalid target syntax: ${content}`));
                    return;
                }
                /* jshint ignore:end */

                let name = RegExp.$1;

                file2nameMap[file] = name;
                resolve(name);
            });
        });
    }

};
