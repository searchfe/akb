/**
 * @file cron.js
 * @author sekiyika(pengxing@baidu.com)
 */

/**
 * cron tasks configuration
 *
 * @type {Object}
 */
module.exports = {

    /**
     * the directory of cron tasks
     *
     * @type {string}
     */
    dir: './app/cron',

    /**
     * cron tasks
     *
     * example:
     *
     * ```javascript
     * {
     *     'task1': '* * * * * *' // this task will be executed every second
     * }
     * ```
     */
    crons: {}

};
