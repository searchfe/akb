/**
 * @file useSession middleware
 * @author huanghuiquan(huanghuiquan@baidu.com)
 */

module.exports = function (app) {
    return async (ctx, next) => {
        await next();
        if (app.config.session.enable) {
            console.log('in use session');
            ctx.session.count = ctx.session.count || 0;
            ctx.session.count += 1;
            console.log(ctx.session.count);
            console.log('leave use session');
        }
    };
};
