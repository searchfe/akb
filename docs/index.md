# akb

`akb`是企业级的框架，但却并不是很重，拥有很多其他框架没有的优点

 - 目录结构清晰，易于维护
 - 容易上手
 - 基于Koa2，使用`async`和`await`同步编程的方式开发
 - 完善的错误处理和日志系统
 - 拥有配套的异常统计系统 planck


## 如何使用

`akb`提供了脚手架工具`akb-cli`


### 创建`akb-demo`

```javascript
$ npm install -g akb-cli
$ akb-cli --help
$ akb-cli create akb-demo
```

### 启动

```javascript
$ cd akb-demo
$ node index.js
```

启动后访问http://localhost:8849/
