/**
 * @file logger
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const winston = require('winston');
const chalk = require('chalk');
const {existsSync, mkdirSync} = require('fs');
const relative = require('path').relative;
const format = require('util').format;
const resolve = require('../util').resolve;

const token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMs])\1?/g;

const halfHour = 1800000;

const colorMap = {
    debug: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red'
};

const levelMap = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

module.exports = function logger(app) {

    const {
        logger: config,
        globals: {
            env,
            appname
        }
    } = app.config;

    // Developer custom logger engine.
    if (config.engine) {
        return config.engine.call(undefined, app);
    }

    const logPath = resolve(app.appdir, config.dir);

    /**
     * logger
     *
     * @class
     */
    class Logger {

        /**
         * constructor
         *
         * @private
         */
        constructor() {

            this.pathPrefix = logPath + '/' + appname;

            this.logFile = this.pathPrefix + '.log';
            this.wfLogFile = this.pathPrefix + '.log.wf';

            this.transports = config.transports;
            this.wfTransports = config.wfTransports;

            this.oldLoggerList = new Set();

            this.started = false;

            /**
             * profilers handlers
             * @type {Array<string>}
             */
            this.profilers = [];

            this.create();
        }

        /**
         * preparations
         *
         * @private
         */
        create() {

            if (!existsSync(logPath)) {
                mkdirSync(logPath);
            }

            // dailyRotate: Always keep two loggers simultaneously
            if (config.dailyRotatePattern) {
                // Initial Logger
                this.dailyRotate();
                // Next Logger
                this.dailyRotate();
            }
            else {
                let loggers = this.createLoggers(this.logFile, this.wfLogFile);
                this.shiftLoggers(loggers);
            }
        }

        /**
         * Set a cron job to check whether it is a new date or not every 30 mins
         * If 30 mins later will be another day, create new loggers and prepare for shifting
         * When the next 0 o'clock time strikes, do the shifting
         *
         * @private
         */
        dailyRotate() {
            let timestamp = Date.now();
            let dailyRotatePatternStr = getFormattedDate(
                config.dailyRotatePattern,
                timestamp + (this.started ? halfHour : 0)
            );

            // Get full log filename by appointed rotatePattern
            let logFile = this.logFile + dailyRotatePatternStr;
            let wfLogFile = this.wfLogFile + dailyRotatePatternStr;

            let oldLoggerList = this.oldLoggerList;

            // Check if logfile exist
            if (!oldLoggerList.has(logFile) && !oldLoggerList.has(wfLogFile)) {

                oldLoggerList.clear();
                oldLoggerList.add(logFile);
                oldLoggerList.add(wfLogFile);

                // Pre-create new loggers
                let newLoggers = this.createLoggers(logFile, wfLogFile);

                if (this.started) {
                    // Calculate the timegap between NOW and the next day so as to set timer for shifting
                    let clock = new Date(timestamp + halfHour).setHours(0, 0, 0, 0) - timestamp;

                    setTimeout(() => {
                        this.shiftLoggers(newLoggers);
                    }, clock).unref();
                }
                // Start up loggers at once if system just initiated
                else {
                    this.shiftLoggers(newLoggers);
                    this.started = true;
                }
            }

            let oldTimer = this.rotateTimer;
            this.rotateTimer = setTimeout(() => this.dailyRotate(), halfHour);
            // 防止阻塞进程退出
            this.rotateTimer.unref();
            clearTimeout(oldTimer);
        }

        /**
         * create loggers
         *
         * @param  {string} logFile logFileName of level - info/debug
         * @param  {string} wfLogFile logFileName of level - warn/error
         * @return {Object} new loggers
         * @private
         */
        createLoggers(logFile, wfLogFile) {
            let transports = !config.overrideTransports ? this.transports : [];

            // info/debug transports
            transports.push(new winston.transports.File({
                name: logFile,
                filename: logFile,
                maxsize: config.maxsize,
                level: config.level,
                json: false,
                timestamp: getTimeStr
            }));

            let wfTransports = !config.overrideTransports ? this.wfTransports : [];

            // warn/error transports
            wfTransports.push(new winston.transports.File({
                name: wfLogFile,
                filename: wfLogFile,
                maxsize: config.maxsize,
                level: 'warn',
                json: false,
                timestamp: getTimeStr
            }));

            return {
                logger: new winston.Logger({
                    exitOnError: false,
                    transports: transports
                }),
                wfLogger: new winston.Logger({
                    exitOnError: false,
                    transports: wfTransports
                })
            };
        }

        /**
         * shift to new loggers
         *
         * @param {Object} newLoggers newLoggers
         * @private
         */
        shiftLoggers(newLoggers) {
            let oldLogger = this.logger;
            let oldWfLogger = this.wfLogger;

            this.logger = newLoggers.logger;
            this.wfLogger = newLoggers.wfLogger;

            // To dispose old loggers in case of memory leaking
            if (oldLogger) {
                oldLogger.close();
            }
            if (oldWfLogger) {
                oldWfLogger.close();
            }
        }

        /**
         * logger actual handler
         *
         * @param {string} level level
         * @param {Object} args arguments
         * @param {winston.Logger} logger logger
         * @private
         */
        log(level, args, logger = this.logger) {
            if (!config.enable) {
                return;
            }

            // Return if level is lower than the one we set by config to reduce the waste of performance
            if (levelMap[config.level] > levelMap[level]) {
                return;
            }

            let msg = '';
            // If Error is under printing
            if (args.length === 1 && args[0] instanceof Error) {
                msg = args[0].stack || args[0].toString();
            }
            else {
                msg = format(...args);
            }

            let prefix = process.pid + ' ';
            // If position info is needed, fetch it as prefix
            if (isLineNoAllowed(config, level)) {
                let info = getPosition();
                prefix += `[${relative(app.appdir, info.currentFile)}:${info.currentLine}] `;
            }

            // To split log messages into several lines in order to print seperately and clearly
            msg = msg.split('\n');
            for (let message of msg) {
                logger[level](prefix + message);

                if (env !== 'production') {
                    consoleLogAccordingToLevel(level, prefix + message);
                }
            }
        }

        /**
         * debug logger
         *
         * @param {...Array} args args
         * @public
         */
        debug(...args) {
            this.log('debug', args);
        }

        /**
         * info logger
         *
         * @param {...Array} args args
         * @public
         */
        info(...args) {
            this.log('info', args);
        }

        /**
         * warn logger
         *
         * @param {...Array} args args
         * @public
         */
        warn(...args) {
            this.log('warn', args, this.wfLogger);
        }

        /**
         * error logger
         *
         * @param {...Array} args args
         * @public
         */
        error(...args) {
            this.log('error', args, this.wfLogger);
        }

        /**
         * profile logger
         * output the duration of an operation, YOU MUST call this func twice to wrap your operation
         *
         * @param {...Array} args args
         * @public
         */
        profile(...args) {
            let now = Date.now();
            let level = args[0];
            let key = args[1];

            if (this.profilers[key]) {
                let then = this.profilers[key];
                delete this.profilers[key];

                // To exclude `level` from args
                args = Array.prototype.slice.call(args, 1);
                args.push('duration: ' + (now - then) + 'ms');
                this[level](...args);
            }
            else {
                this.profilers[key] = now;
            }
        }

        /**
         * dispose logger
         */
        dispose() {
            if (this.logger) {
                this.logger.close();
            }

            if (this.wfLogger) {
                this.wfLogger.close();
            }

            config.transports = [];
            config.wfTransports = [];
        }
    }

    return new Logger();
};

/**
 * whether to print position according to level info
 *
 * @param {Object} config config of logger
 * @param {string} level level of log message
 * @return {*}
 */
function isLineNoAllowed(config, level) {
    if (typeof config.lineno === 'object') {
        return config.lineno[level];
    }

    return level;
}

/**
 * get the stack trace infomation of error logs
 *
 * @return {{stack: (Error.stack|*), currentLine: number, currentFile: string}}
 */
function getPosition() {
    let orig = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;

    let err = new Error();
    Error.captureStackTrace(err, getPosition);
    let stack = err.stack;
    Error.prepareStackTrace = orig;

    return {
        stack: stack,
        currentLine: stack[2].getLineNumber(),
        currentFile: stack[2].getFileName()
    };
}

/**
 * colorize level and output it
 *
 * @param {string} level level
 * @param {string} str log message
 */
function consoleLogAccordingToLevel(level, str) {
    let msg = level;
    let color = colorMap[level];

    if (chalk[color]) {
        msg = chalk[color](level);
    }

    msg = msg + ' ' + str;
    console.log(msg);
}

/**
 * get formatted realtime str
 *
 * @return {string} formatted realtime str
 */
function getTimeStr() {
    return getFormattedDate('yyyy-MM-dd HH:mm:ss');
}

/**
 * pad a number
 *
 * @param {number} val the value that needed to be padded
 * @param {number} len len of padded value
 * @return {string} padded value
 */
function pad(val, len = 2) {
    val = String(val);

    while (val.length < len) {
        val = '0' + val;
    }

    return val;
}

/**
 * dateFormatter
 *
 * @param {string} datePattern custom pattern to format date
 * @param {number} timestamp timestamp
 * @return {string} formatted date str
 */
function getFormattedDate(datePattern, timestamp = Date.now()) {
    if (!datePattern) {
        return '';
    }

    if (typeof timestamp === 'string') {
        timestamp = Number(timestamp);
    }

    let now = new Date(timestamp);

    let [year, month, date, hour, minute, second] = [
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
    ];

    let flags = {
        yy: String(year).slice(2),
        yyyy: year,
        M: month,
        MM: pad(month),
        d: date,
        dd: pad(date),
        H: hour,
        HH: pad(hour),
        m: minute,
        mm: pad(minute),
        s: second,
        ss: pad(second)
    };

    return datePattern.replace(token, function ($0) {
        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
}
