# logger

logger是`akb`中负责存储日志的模块，`config/logger.js`就是`logger`模块的配置文件

## 使用方法

`logger`模块对外暴露了`debug`、`info`、`warn`、`error`四个方法，按日志内容的重要程度逐级递增划分，由开发者自行调用

如果已经按照配置完成了`logger`模块的配置，那么可以使用如下方法来使用

```
ctx.app.logger.info('hello world');
```

## 默认配置

```javascript
module.exports = {

    /**
     * 日志引擎，默认是winston；支持开发者自定义日志引擎
     *
     * ```javascript
     * function (app) {
     *     return {
     *         debug(){...},
     *         info(){...},
     *         warn(){...},
     *         error(){...}
     *     };
     * }
     *
     * ```
     *
     * @type {Function|undefined}
     */
    engine: undefined,

    /**
     * 是否启用日志引擎
     *
     * @type {boolean}
     */
    enable: true,

    /**
     * 存储日志的目录，默认是 ${appdir}/logs
     *
     * @type {string}
     */
    dir: './logs',

    /**
     * 调用记录日志的方法时是否需要打印行号，key值分别有debug、info、warn、error
     *
     * @type {Object}
     */
    lineno: {
        warn: true,
        error: true
    },

    /**
     * 当前代码环境需要启用的日志记录层级，分别有debug、info、warn、error可选
     *
     * @type {boolean}
     */
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

    /**
     * 单个日志文件的最大体积，默认是4GB
     *
     * @type {number}
     */
    maxsize: 4 * 1024 * 1024 * 1024 * 1024,

    /**
     * 是否启用以天为单位的日志记录模式
     * 若该配置项有值，表示每天的日志都会存储在单独的文件里，以该配置项值为文件名后缀模式；若该配置项不存在或为无效值，则表示日志引擎只使用一个日志文件记录日志
     *
     * @type {string}
     */
    dailyRotatePattern: '.yyyy-MM-dd',

    /**
     * 是否覆盖默认的transport。默认为覆盖，设置为false则为添加
     *
     * @type {boolean}
     */
    overrideTransports: true,

    /**
     * debug 和 info 方法使用的transport
     *
     * 日志引擎默认会有输出到文件的transport，console类型的transport只有在非生产环境的模式下会启用
     * 开发者可以在该配置项使用自定义的transport，并配合overrideTransports使用
     *
     * @type {Array.<winston.transports.Transport>}
     */
    transports: [],

    /**
     * warn 和 error 方法使用的transport
     *
     * 日志引擎默认会有输出到文件的transport，console类型的transport只有在非生产环境的模式下会启用
     * 开发者可以在该配置项使用自定义的transport，并配合overrideTransports使用
     *
     * @type {Array.<winston.transports.Transport>}
     */
    wfTransports: []

};

```

