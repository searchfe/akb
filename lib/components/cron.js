/**
 * @file cron.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const path = require('path');
const CronJob = require('cron').CronJob;
const util = require('../util');

module.exports = async function (app) {

    let {dir: cronDir, crons} = app.config.cron;

    // 处理为绝对地址
    cronDir = util.resolve(app.config.appdir, cronDir);

    /**
     * cron job store
     *
     * @type {Map}
     */
    let jobStore = new Map();

    // load all cron jobs
    await reload();

    return {reload, dispose};

    /**
     * reload all jobs
     */
    async function reload() {
        // dispose all jobs
        dispose();

        jobStore = new Map();

        for (let name of Object.keys(crons)) {
            let fn = require(path.join(cronDir, name))(app);
            if (fn instanceof Promise) {
                fn = await fn;
            }

            let job = new CronJob(crons[name], fn);

            jobStore.set(name, job);
            job.start();
        }
    }

    function dispose() {
        for (let job of jobStore.values()) {
            // stop the job
            job.stop();
        }

        jobStore.clear();
    }

};
