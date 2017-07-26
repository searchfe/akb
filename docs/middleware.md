# middleware 中间件

middleware是`akb`中处理公共逻辑中间件。 通过 `config/middleware.js` 配置文件指定 middleware 的执行顺序和执行的时机。

## akb中间件约定

akb的中间件实际上是一个函数，参数是akb实例（约定取名 `app` ），可以通过 `app` 获取所有配置来初始化中间件的运行环境，akb中间件返回一个[koa2中间件](https://github.com/koajs/koa/blob/v2.x/Readme.md#middleware)，返回值是实际应用到server上的中间件，如果akb中间件返回的是 `undefined`，则该中间件不会应用到server。

``` javascript
/**
 * akb middleware
 *
 * @param  {Akb} app akb实例
 * @return {Function} 同koa middleware
 */
function (app) {
    // 初始化内容
    return async function (ctx, next) {
        // 动态内容
        await next();
    };
}
```

## 请求类型

中间件配置可以将中间件应用到不同类型请求，他们分别是 `all` `dynamic` `static`

- all

所有类型的请求，包含 `dynamic` `static` 两种请求。

- dynamic

动态请求，即非静态资源的请求

- static

静态资源类型请求


## 配置说明

middleware 模块的配置文件为`config/middleware.js`

- [dir](#dir)
- [all](#all)
- [dynamic](#dynamic)
- [static](#static)

### dir

`string`

指定middleware的文件目录，默认为 `app/middlewares`

### all

`Array.<string|Array>`

应用到所有请求的中间件配置，akb将按照数组顺序执行中间件，数组的值对应 [dir](#dir) 中的文件名，如果值是一个数组则表示要并行执行中间件。

### dynamic

`Array.<string|Array>`

应用到dynamic类型请求的中间件配置，配置同 [all](#all)

### static

`Array.<string|Array>`

应用到static类型请求的中间件配置，配置同 [all](#all)


## 默认配置

```javascript
module.exports = {
    /**
     * the dir of all middlewares
     *
     * @type {string}
     */
    'dir': './app/middlewares',

    /**
     * all requests will pass through these middlewares.
     *
     * @type {Array.<string|Array>}
     */
    'all': [],

    /**
     * only dynamic requests will pass through these middlewares.
     *
     * @type {Array.<string>}
     */
    'dynamic': [],

    /**
     * only static requests will pass through these middlewares.
     *
     * @type {Array.<string>}
     */
    'static': []

};
```