/**
 * @file extends
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

'use strict';

const statuses = require('statuses');

module.exports = function (app) {

    const JSONP_CALLBACK = app.config.http.jsonpCallback || 'callback';

    let {logger, context: {'throw': throwError}} = app;

    let methods = {

        /**
         * 获取route匹配的参数、get和post的参数
         *
         * @param  {string} name 参数名
         * @return {*}
         */
        param(name) {
            return this.params[name];
        },

        /**
         * render template by name
         *
         * @param {string} name template name
         * @param {Object} data data
         * @return {Promise.<string, Error>}
         */
        async render(name, data) {
            return await app.view.render(name, Object.assign({}, this.locals || {}, data));
        },

        /**
         * response json data
         *
         * @param {string|number|boolean|Object} data data
         */
        json(data) {
            // set content-type
            if (!this.response.get('Content-Type')) {
                this.set('Content-Type', 'application/json');
            }

            this.body = JSON.stringify(data);
        },

        /**
         * Send JSON response with JSONP callback support.
         *
         * @see https://github.com/expressjs/express/blob/master/lib/response.js#L265
         * @param {string|number|boolean|Object} data data
         */
        jsonp(data) {
            let callback = this.param(JSONP_CALLBACK);

            if (Array.isArray(callback)) {
                callback = callback[0];
            }

            if (!callback) {
                this.json(data);
                return;
            }

            this.set('Content-Type', 'text/javascript;charset=utf-8');
            this.set('X-Content-Type-Options', 'nosniff');

            // restrict callback charset
            callback = callback.replace(/[^\[\]\w$.]/g, '');

            // replace chars not allowed in JavaScript that are in JSON
            let body = JSON.stringify(data)
                .replace(/\u2028/g, '\\u2028')
                .replace(/\u2029/g, '\\u2029');

            this.body = '/**/ typeof ' + callback + ' === \'function\' && ' + callback + '(' + body + ');';
        },

        throw(...args) {
            try {
                throwError.apply(null, args);
            }
            catch (e) {
                // 标记是自己抛出的异常
                e.selfThrew = true;
                throw e;
            }
        },

        onerror(err) {
            if (null == err) {
                return;
            }

            // delegate
            app.emit('error', err, this);

            // nothing we can do here other than delegate to the app-level handler and log
            if (this.headerSent || !this.writable) {
                err.headerSent = true;
                return;
            }

            // unset all headers, and set those specified
            this.res._headers = {};

            app.controller.errorHandler(err, this)
                .then(() => {
                    // set error headers as addition
                    this.set(err.headers);

                    // responses
                    if (Buffer.isBuffer(this.body)) {
                        return this.res.end(this.body);
                    }

                    if ('object' === typeof this.body) {
                        this.body = JSON.stringify(this.body);
                    }

                    this.res.end(this.body);
                })
                .catch(e => {
                    logger.error(e);

                    // set error headers as addition
                    this.set(err.headers);

                    // if already in error handler processing
                    // it won't enter error handler again
                    let code = statuses[err.status];
                    let msg = err.expose ? err.message : code;
                    this.status = err.status;
                    this.res.end(msg);
                });
        }
    };

    // extends methods to app.context
    Object.assign(app.context, methods);

    // define params
    Object.defineProperty(app.context, 'params', {
        configurable: true,
        set(val) {
            this._params = val;
        },
        get() {
            if (!this._params) {
                let {query, request} = this;
                this._params = Object.assign({}, request.body, query);
            }

            return this._params;
        }
    });
};
