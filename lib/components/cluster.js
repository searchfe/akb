/**
 * @file cluster
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const cluster = require('cluster');

/**
 * cluster
 *
 * @param {Akb} app app
 * @return {Object}
 */
module.exports = function (app) {

    const STARTED_EVENT = 'started';
    const CLOSE_EVENT = 'close';

    let config = app.config.server;
    let server;

    return {

        /**
         * run
         *
         * @return {Server}
         */
        run() {
            if (!config.cluster.enable) {
                server = app.listen(config.port, config.host, function (err) {
                    if (err) {
                        throw err;
                    }
                    app.emit(STARTED_EVENT);
                    app.hook(STARTED_EVENT, {server});
                });
            }
            else {
                this.startCluster();
            }

            if (cluster.isWorker) {
                // 设置 timeout
                server.setTimeout(
                    app.config.http.timeout || 30000,
                    socket => {
                        socket.end();
                    }
                );
            }

            return server;
        },

        /**
         * close server
         */
        close() {
            if (!config.cluster.enable) {
                server.close(() => {
                    app.emit(CLOSE_EVENT);
                    app.hook(CLOSE_EVENT, {server});
                });
            }
            else if (cluster.isMaster) {
                cluster.disconnect(() => {
                    app.emit(CLOSE_EVENT);
                    app.hook(CLOSE_EVENT, {server});
                });
            }
        },

        /**
         * run cluster
         */
        startCluster() {
            if (cluster.isMaster) {
                let count = config.cluster.max;

                for (let i = 0; i < count; i++) {
                    cluster.fork();
                }

                let started = false;

                cluster.on('exit', worker => {
                    app.logger.error(`worker pid: ${worker.process.pid} died!`);

                    // if server has already started, fork a new process instead of the dead one.
                    if (started) {
                        cluster.fork();
                    }
                });

                let num = 0;
                cluster.on('listening', () => {
                    if (++num === count) {
                        started = true;
                        app.emit(STARTED_EVENT);
                        app.hook(STARTED_EVENT, {server});
                    }
                });

                // 如果调了close, cluster不要尝试重启新的进程
                app.on('close', () => started = false);
            }
            else {
                server = app.listen(config.port, config.host, err => {
                    if (err) {
                        throw err;
                    }
                    app.emit(STARTED_EVENT);
                    app.hook(STARTED_EVENT, {server});
                });
            }
        }
    };

};
