/**
 * @file akb
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const autoReload = require('./utils/autoReload');
const path = require('path');
const Koa = require('koa');

const config = require('./components/config');
const monitor = require('./components/monitor');
const logger = require('./components/logger');
const router = require('./components/router');
const cluster = require('./components/cluster');
const view = require('./components/view');
const ral = require('./components/ral');
const session = require('./components/session');
const controller = require('./components/controller');
const hook = require('./components/hook');
const cron = require('./components/cron');
const middlewares = require('./middlewares');
const component = require('./components/component');

/**
 * Akb
 *
 * @constructor
 * @class
 * @export
 */
class Akb extends Koa {

    /**
     * akb constructor
     *
     * @constructor
     * @param {Object} options 初始化参数
     * @param {string} options.appdir 初始项目目录
     * @param {string} options.configdir 配置目录
     */
    constructor(options = {}) {
        super();

        /**
         * app directory
         *
         * @type {string}
         * @public
         */
        this.appdir = options.appdir ? path.resolve(options.appdir) : process.cwd();

        /**
         * 配置所在目录
         *
         * @type {string}
         * @public
         */
        this.configdir = path.resolve(this.appdir, options.configdir || 'config');

        /**
         * cached components
         *
         * @private
         * @type {Map}
         */
        this.components = new Map();

        this.on('started', () => this.usage());

        process.on('uncaughtException', err => {
            try {
                // try inner logger first
                this.logger.error(err.stack);
            }
            catch (e) {
                console.error(err);
            }
        });

        process.on('unhandledRejection', err => {
            this.logger.warn(err.stack);
        });

        this.load();
    }

    load() {
        // we should init and load config first, then logger
        this.config = config(this);

        // override properties in koa instance using variables from configuration
        this.proxy = this.config.server.proxy;
        this.subdomainOffset = this.config.server.subdomainOffset;
        this.env = this.config.globals.env;

        if (this.config.session.enable) {
            this.keys = this.config.session.keys;
        }

        this.component('monitor', monitor(this));
        this.component('logger', logger(this));
    }

    /**
     * reload all components
     */
    async reload() {
        this.dispose();
        this.load();
        await this.loadComponents();
        middlewares(this);
    }

    /**
     * load internal components
     *
     * @private
     */
    async loadComponents() {
        this.component('router', router(this));
        this.component('controller', controller(this));
        this.component('view', view(this));
        this.component('ral', ral(this));
        this.component('session', session(this));
        this.component('cluster', cluster(this));
        this.component('hook', await hook(this));
        this.component('cron', await cron(this));
        this.component('loadComponnets', await component(this));
    }

    /**
     * add component to app
     *
     * @param {string} name name of component
     * @param {*} component component
     * @return {Akb}
     * @private
     */
    component(name, component) {
        this[name] = component;
        // cache components
        this.components.set(name, component);

        return this;
    }

    /**
     * Return JSON representation. We only show settings.
     *
     * @return {Object}
     * @override
     * @public
     */
    toJSON() {
        return this.config;
    }

    /**
     * run server
     *
     * @public
     * @return {net.Server} http server
     */
    async run() {
        // load internal components
        await this.loadComponents();
        // add middlewares
        middlewares(this);

        // auto reload
        if (this.config.globals.enableHotReload) {
            if (this.config.server.cluster.enable) {
                this.logger.warn('Hot reload can not support cluster.');
            }
            else {
                autoReload(this);
            }
        }

        return this.cluster.run();
    }

    /**
     * close server
     */
    close() {
        this.dispose();
        this.cluster.close();
    }

    /**
     * dispose
     *
     * @private
     */
    dispose() {
        for (let component of this.components.values()) {
            if (component && component.dispose && typeof component.dispose === 'function') {
                component.dispose();
            }
        }

        this.components.clear();
    }

    /**
     * usage
     *
     * @private
     */
    usage() {
        let config = this.config;
        console.log('\n====================================================');
        console.log('PID          : ' + process.pid);
        console.log('node.js      : ' + process.version);
        console.log('====================================================');
        console.log('Name         : ' + config.globals.appname);
        console.log('Appdir       : ' + config.appdir);
        console.log('Version      : ' + config.globals.version);
        console.log('Date         : ' + new Date());
        console.log('Mode         : ' + this.env);
        console.log('====================================================\n');
        console.log('Listen to    : ' + config.server.host + ':' + config.server.port);
        console.log('');
    }

}

module.exports = Akb;
