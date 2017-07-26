/**
 * @file error
 * @author chenqiushi(chenqiushi@baidu.com)
 */

'use strict';

const dynamicGenerator = require('./dynamic');

module.exports = function (app) {
    let {logger, config: {errorHandler: handlerConfig}} = app;

    return async function error(ctx, err) {
        if (!(err instanceof Error)) {
            // 完善错误日志
            err = new Error(JSON.stringify(err));
            err.selfThrew = true;
        }

        // 开发者自己抛的日志报警，捕获的错误打错误日志，404的不打日志，设置为silent也不打
        if (err.statusCode !== 404 && !ctx.silent) {
            if (err.selfThrew) {
                logger.warn(err);
            }
            else {
                logger.error(err);
            }
        }

        // 将http code写入ctx
        ctx.status = err.status;

        let config = handlerConfig;
        if (config.statusCode[err.status]) {
            config = {
                target: config.statusCode[err.status]
            };
        }

        // 如果配置过，则使用已经配置的internal error处理方法
        if (config.target) {
            ctx.route = ctx.route || {};
            let options = ctx.route.options = ctx.route.options || {};
            // 设置成错误处理的target
            options.target = config.target;

            let action = dynamicGenerator(app);
            ctx.error = err;

            await action.call(ctx, ctx, err);
        }
        else {
            throw new Error('error handler not found');
        }
    };

};
