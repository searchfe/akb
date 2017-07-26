# config

配置是`akb`的核心，也是`akb`的设计理念之一：把整个系统中所有的配置集中管理，所以在`akb`中，有一个单独的目录叫`config`

## 如何使用

**注：**如果没在启动的时候像这样指定配置的目录`new Akb('./appdir')`，那么系统会默认认为`config`目录在`process.cwd()`目录下。

`akb`会扫描`config`目录下的所有js文件，并且会逐级挂载到`app`对象中，如下面的例子所示

```javascript
module.exports = async function action(ctx) {
	ctx.json(ctx.app.config.globals);
};
```

## 默认配置

`akb`内置了很多模块，因此也有很多的默认配置文件，目前内置的配置文件有下面这些

- errorHandler.js - 错误处理
- globals.js - 全局配置
- http.js - 请求相关
- logger.js - 日志
- middleware.js - 中间件的配置
- monitor.js - 监控系统
- ral.js - node-ral模块的配置
- router.js - 路由
- server.js - 服务器
- session.js - session服务
- [view.js](../docs/view.md) - 渲染模板


