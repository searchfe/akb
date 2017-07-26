/**
 * @file index.js
 * @author sekiyika (px.pengxing@gmail.com)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const etpl = require('./etpl');
const resolve = require('../../util').resolve;

module.exports = function view(app) {

    let {logger, config: {view: config}} = app;
    let templateDir = resolve(app.config.appdir, config.templateDir);
    let filterDir = resolve(app.config.appdir, config.filterDir);
    let engine = (config.engine || etpl).call(undefined, app);

    /**
     * cached filter
     *
     * @type {Object.<string, Function>}
     */
    let filterStore = {};

    /**
     * cached and compiled template
     *
     * @type {Object.<string, Function>}
     */
    let cacheStore = {};

    // add filters
    if (!engine.addFilter) {
        logger.warn('your template engine does\'t support addFilter, All filters will be ignored.');
    }
    else {
        config.filters.forEach(name => {
            let filepath = path.join(filterDir, name + '.js');

            try {
                let fn = require(filepath).call(undefined, app);
                addFilter(name, fn);
            }
            catch (err) {
                logger.error(err);
            }
        });
    }

    return {

        /**
         * engine
         *
         * @type {Function}
         */
        get engine() {
            return engine;
        },

        /**
         * plugin store
         *
         * @type {Object.<string, Function>}
         */
        get filterStore() {
            return filterStore;
        },

        /**
         * render function
         *
         * @param {string} name template name
         * @param {Object} data data
         * @return {Promise.<string, Error>}
         */
        async render(name, data) {
            await app.hook('beforeRender', {name, data});

            let fn;

            if (config.cacheable) {
                fn = cacheStore[name];
            }

            if (!fn) {
                fn = await generate(name);

                if (config.cacheable) {
                    cacheStore[name] = fn;
                }
            }

            let text = await fn(data);

            app.hook('afterRender', {name, data, text});

            return text;
        },


        /**
         * add filter
         *
         * @type {Function}
         */
        get addFilter() {
            return addFilter;
        }
    };


    /**
     * add filter to engine, and cache all filters.
     *
     * @param {string} name name of the filter
     * @param {Function} fn function
     */
    function addFilter(name, fn) {
        // add filter
        engine.addFilter(name, fn);
        // cache filter
        filterStore[name] = fn;
    }

    /**
     * generate render function
     *
     * @param {string} name template name
     * @return {Promise.<Function, Error>}
     */
    function generate(name) {
        let filepath = resolve(templateDir, name + config.ext);

        return new Promise((resolve, reject) => {
            fs.stat(filepath, error => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(async opts => await engine(filepath, opts));
            });
        });
    }

};
