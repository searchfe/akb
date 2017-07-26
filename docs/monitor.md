# monitor

`monitor`是`akb`中负责监控统计框架本身是否正常运行的辅助模块，__默认关闭，关闭不影响框架的正常使用__。`config/monitor.js`是`monitor`模块的配置文件

## 介绍

作为一个提供网络服务的框架，其性能，稳定性，业务指标等均是开发者需要关注的。`monitor`模块提供了默认发送日志的机制，帮助开发者从日志中发掘系统的各项指标。

`monitor`的运行原理是讲所有本地日志通过网络请求发送到一个指定的机器，供总结分析。这里的日志包括：

1. 框架本身的日志，开发者无法控制。如系统启动、进程重启等。
2. 系统开发者手动打印的日志。如接口访问耗时，业务相关的报警错误等。

通过分析日志，可以获得各类系统数据和指标，方便监控统计，全方位掌握系统本身。例如：

### 系统接口性能

![系统接口性能](http://boscdn.bpc.baidu.com/assets/akb/doc/monitor-1.png)

### 页面PV

![页面PV](http://boscdn.bpc.baidu.com/assets/akb/doc/monitor-2.png)

## 使用方法

只要正确进行配置，不需要显式调用，系统会自动定时发送日志。

## 配置方法

1. `enable`设置为`true`
2. `idc`用于区分不同的集群，分类统计
3. `host`, `port`, `path`用于配置接收日志的服务器地址。__注意：当一次性发送日志较多时，会采用`gzip`压缩日志，此时会带有参数`gzip=1`。
4. `sendInterval`用于配置日志发送间隔时间。

默认配置如下：

```javascript
module.exports = {

    /**
     * enable monitor, enabled default
     *
     * @type {Boolean}
     */
    enable: false,

    /**
     * service IDC
     *
     * @type {String}
     */
    idc: 'unknown',

    /**
     * akb-monitor ip
     *
     * @type {String}
     */
    host: '10.58.173.21',

    /**
     * akb-monitor port
     *
     * @type {String}
     */
    port: '8301',

    /**
     * akb-monitor path
     *
     * @type {String}
     */
    path: '/api/receive',

    /**
     * send interval (ms)
     *
     * @type {Number}
     */
    sendInterval: 30000
};
```
