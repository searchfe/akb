# Session

`akb`提供session功能，默认存入本地内存。用户可通过修改配置信息，指定session功能开启或关闭，存储方式等等。`akb`的session功能由[generic-session](https://github.com/koajs/generic-session)模块封装实现。

## 配置说明

session的配置文件为`config/session.js`。

- [enable](#enable)
- [store](#store)
- [keys](#keys)
- [session](#session)

### enable

`boolean`

指定session功能开启或关闭


### store

`Object`

session的存储方式，默认使用内置的MemoryStore，将数据存入本地内存，如需更换其他存储方式，需要传入自定义store，自定义store需实现三个方法：

- [set](#set)
- [get](#get)
- [destroy](#destroy)

#### set

`{Promise} set({string|number}sid, {Object}session)`

写入session的方法

- `{string|number}`sid sid
- `{Object}`session session

#### get

`{Promise} get({string|number}sid)`

通过sid获取session对象，当对象获取成功时，返回Promise对象将获取到session 给 resolve出来

- `{string|number}`sid sid

#### destroy

`{Promise} get({string|number}sid)`

通过sid销毁session对象

- `{string|number}`sid sid

### keys

`Array`

设置签名cookie密钥，该配置项为`必须`配置信息，否则session将无法工作，详情请参阅koa2的[说明文档](https://github.com/koajs/koa/blob/master/docs/api/index.md#appkeys)

### session

`Object`

该配置项为generic-session的相关配置信息，详情请参阅generic-session的[说明文档](https://github.com/koajs/generic-session#options)


## 使用方法

在`akb`中可通过ctx.session获取当前用户的session对象，根据实际情况对ctx.session对象进行操作即可。

```javascript
// example
ctx.session.name = 'xxx';
let sid = ctx.session.name;
ctx.session = null;
```