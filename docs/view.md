# view

view是`akb`中负责模板渲染的模块，`config/view.js`就是`view`模块的配置文件

## 使用方法

如果已经按照配置完成了`view`模块的配置，那么可以使用如下方法来使用

```
let html = await ctx.app.view.render('hello', {name: 'world'});
```

一般情况下，开发者不需要直接使用`app.view.render`函数，在`action`中，已经封装好了`render`函数

```
ctx.body = await ctx.render('hello', {name: 'world'});
```

## 默认配置

```javascript
module.exports = {

    /**
     * 渲染引擎，默认是etpl，开发者可以按照下面的例子自定义模板
     *
     * ```javascript
     * function (app) {
     *     function fn(path, options) {return new Promise();}
     *     fn.addFilter = function () {};
     *
     *     return fn;
     * }
     *
     * ```
     *
     * @type {Function}
     */
    engine: undefined,

    /**
     * 模板存放的目录
     *
     * @type {string}
     */
    templateDir: './views',

    /**
     * `filter`的目录
     *
     */
    filterDir: './app/filters',

    /**
     * 是否缓存编译模板
     *
     * @type {boolean}
     */
    cacheable: process.env.NODE_ENV === 'production',

    /**
     * 模板后缀
     *
     * @type {string}
     */
    ext: '.tpl',

    /**
     * 启用的`filter`
     *
     *
     * file: encodeHTML.js
     * ```javascript
     * module.exports = function (app) {
     *     return function encodeHTML(...args) {};
     * }
     * ```
     *
     * @type {Array.<string>}
     */
    filters: [],

    /**
     * 渲染引擎的初始化参数，默认是`etpl`的
     *
     * @type {Object}
     * @property {string} options.commandOpen etpl option
     * @property {string} options.commandClose etpl option
     * @property {boolean} options.strip etpl option
     */
    options: {
        commandOpen: '{{',
        commandClose: '}}',
        strip: true
    }
};
```
