# 后端服务管理（RAL）

RAL是`akb`的后端服务管理模块，统一各种通信协议、数据格式的请求接口，提供集中化的服务资源配置管理能力。

## 配置说明

`config/ral.js`是其对应的配置文件。

- [engine](#engine)
- [timeout](#timeout)
- [retry](#retry)
- [service](#service)

### engine

`Object`

使用[node-ral](https://github.com/fex-team/node-ral)作为默认引擎。也可以选择使用[yog-ral](http://gitlab.baidu.com/fex/yog-ral)，yog-ral在百度内部支持比较好，有mcpack。

```javascript
module.exports = {
    engine: require('yog-ral')
};
```

### timeout

`number`

超时，默认为3000ms

### retry

`retry`

请求重试次数，默认为2

### service

`Object.<string, Config>`

服务配置键值对，在使用的时候，可通过指定服务名调取对应的配置，如

```javascript
module.exports = {
    service: {
        PASSPORT: {
            protocol: 'http',
            pack: 'json'
            // ...
        },
        BACKEND: {
            pack: 'querystring'
        }
    }
};
```

具体配置项可参考[node-ral](https://github.com/fex-team/node-ral/wiki/%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F)或[yog-ral](http://gitlab.baidu.com/fex/yog-ral)的配置系统。

### 使用方法

通过ctx.app.ral获取发送请求的方法，需要传入两个参数：

1. 服务名称
2. 额外配置

RAL会首先通过服务名称到配置里获取配置，然后通过Object.assign将服务配置和额外配置合并后，作为最终的配置参数去发请求。

```javascript
ctx.app.ral('PASSPORT', {
    path: 'xxx/xxx',
    data: {
        username: 'xxx',
        passport: 'xxxxx'
    }
})
.then(data => {

})
.catch(error => {

});
```

该方法返回`Promise`对象。