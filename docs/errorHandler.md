# 错误处理（errorHandler）

`akb`会自动捕获应用程序中的错误，并通过内置的`error controller`，将捕获到的错误转交给开发者自定义的`controller`来处理。`config/errorHandler.js`是对应的配置文件。

## 使用方法

可以通过 `ctx.throw([msg], [status], [properties]) ` 抛出常规错误，默认`status`为500

以下几种写法都有效：

```javascript
ctx.throw(404);
ctx.throw(400, 'name required');
ctx.throw('need params userId', 500);
ctx.throw('something exploded');

```
事实上，`ctx.throw('need params userId', 500)` 等同于：

```javascript
let err = new Error('need params userId');
err.status = 500;
throw err;

```

#### 示例

在`config/errorHandler`中配置如下：

```javascript
    controller: 'error',
    action: 'handle',
    statusCode: {
        404: {
            controller: 'error',
            action: 404
        }
    }

```
应用程序中抛出

```javascript
ctx.throw(404, '页面未找到');

```

对应的 `controller/error.js`

```javascript
module.exports = {
    async 404(ctx, err) {
        ctx.status = 404;
        ctx.body = await this.render('error', {errmsg: err.message});
    }
}

```


此外，开发者也可以自定义「错误事件」来监听 akb 应用中发生的错误

```javascript
ctx.app.on('error', err => {
    // TODO
});

```


## 默认配置

```javascript
module.exports = {

    /**
     * 默认错误处理controller名称
     *
     * @type {string}
     */
    controller: 'error',

    /**
     * 默认错误处理action名称
     *
     * @type {string}
     */
    action: 'handle',

    /**
     * 自定义错误状态码对应的controller 与 action 名称
     *
     * ```
     * statusCode: {
     *     404: {
     *         controller: 'error',
     *         action: '404'
     *     },
     *     500: {
     *         controller: 'error',
     *         action: '500'
     *     }
     * }
     * ```
     *
     * @type {Object}
     */
    statusCode: {}

};

```