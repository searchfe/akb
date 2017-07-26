# router 路由

router 是 `akb` 中处理请求分发的部件。 通过 `config/router.js` 配置文件指定请求的路由规则。

## route 路由信息

akb的每一个请求都经过默认中间件router的处理，并将处理后的结果挂在 `ctx.route` 下

- params
    通过规则匹配到的url参数， 如 `/user/baidu` 通过规则 `/user/:name` 将匹配到 `{name: 'baidu'}`

- options
    路由配置里的规则对应的参数表, router会默认将参数表里值为string类型的值进行替换操作，将`{}`里的内容作为key, 查找 `route.params` 的值进行替换，如果 `route.params` 中没有对应的值，则会被替换为 `undefined`

- type
    同 `route.options.type`, 默认为值为 `dynamic`

- redirect
    同 `route.options.redirect`

## 配置说明

- [enableDefaultRoutes](#enableDefaultRoutes)
- [routes](#routes)

### enableDefaultRoutes

`boolean`

是否开启默认路由规则，如果设置为true, 会在默认配置后面增加如下路由规则
```javascript
{
    '/:controller/:action/:id(\\d+)': {
        controller: '{controller}',
        action: '{action}'
    },
    '/:controller/:action': {
        controller: '{controller}',
        action: '{action}'
    },
    '/:controller': {
        controller: '{controller}'
    }
}
```

**注意**：关于这里的`controller`和`action`如何映射到`http.js`配置的`controllerDir`目录中呢，请看下面的[如何映射到对应的文件](#如何映射到对应的文件)

### routes

`Object`

路由规则列表，每一条路由规则由 [匹配规则](#匹配规则) 和 [路由配置](#路由配置) 组成， router 按顺序从前到后依次匹配，优先取第一条匹配到的结果。

#### 匹配规则

`string`

匹配规则由请求方法和 (`Express-style path`字符串)[https://github.com/pillarjs/path-to-regexp]  作为匹配规则，路径匹配到的值会放到`ctx.route.params`中。

请求方法满足一下3点情况：

1. 方法名放在规则前面，以空格和规则分格，多个空格连续当成一个空格；
2. 支持多种方法，方法名之间以空格分格,多个空格连续当成一个空格；
3. 不写方法名，默认支持所有方法。

例：

```js
{
    routes: {
        '/a/b': {
            controller: 'a',
            action: 'c'
        },
        'POST /testMethod': {
            controller: 'a',
            action: 'c'
        },
        'POST GET /:controller/:action': {
            controller: '{controller}',
            action: '{action}'
        },
    }
}
```

##### 命名参数

命名参数是由`:参数名`定义，如 `:foo`。

对 `/route/test` 应用 `/:foo/:bar` 规则将匹配到如下结果
```javascript
{foo: 'route', bar: 'test'}
```

对 `/icon-76.png` 应用 `/(apple-)?icon-:res(\\d+).png` 规则将匹配到如下结果
```javascript
{ 0: undefined, res: '76' }
```

对 `/apple-icon-76.png` 应用 `/(apple-)?icon-:res(\\d+).png` 规则将匹配到如下结果
```javascript
{ 0: 'apple-', res: '76' }
```

**注意：** 命名参数必须是由字母和数字组成 (`[A-Za-z0-9_]`)。

##### 可选参数

可通过在命名参数后面添加 `?` 标识为可选参数

对 `/test` 应用 `/:foo/:bar?` 规则将匹配到如下结果
```javascript
{ foo: 'test', bar: undefined }
```

对 `/test/route` 应用 `/:foo/:bar?` 规则将匹配到如下结果
```javascript
{ foo: 'test', bar: 'route' }
```

##### 0 或 更多

可通过在命名参数后面添加 `*` 标识为 0 或更多参数匹配

对 `/` 应用 `/:foo*?` 规则将匹配到如下结果
```javascript
{ foo: undefined }
```

对 `/bar/baz` 应用 `/:foo*?` 规则将匹配到如下结果
```javascript
{ foo: 'bar/baz' }
```

##### 1 or 更多

可通过在命名参数后面添加 `+` 标识为 1 或更多参数匹配

对 `/` 应用 `/:foo+` 规则将匹配到如下结果
```javascript
null
```

对 `/bar/baz` 应用 `/:foo+` 规则将匹配到如下结果
```javascript
{ foo: 'bar/baz' }
```

对 `/123` 应用 `/:foo(\\d+)` 规则将匹配到如下结果
```javascript
{ foo: '123' }
```

对 `/abc` 应用 `/:foo(\\d+)` 规则将匹配到如下结果
```javascript
null
```

**注意:** `\`需要使用`\`转义.

##### 未命名参数

可以通过只加括号 `()` 包含一个匹配组，且前面没有命名参数时来匹配一个未命名的参数，匹配到的值将以数字作为下标存在 `ctx.params` 下

对 `/test/route` 应用 `/:foo/(.*)` 规则将匹配到如下结果
```javascript
{ foo: 'test', 0: 'route' }
```

##### 星号 *

`*` 可以匹配任何字符，等效于`(.*)`匹配组

对 `/foo/bar/baz` 应用 `/foo/*` 规则将匹配到如下结果
```javascript
{ 0: 'bar/baz' }
```

#### 路由配置

路由配置是匹配规则对应的配置，这里把配置项分为两种：公共配置和特定配置

##### 公共配置

- middleware

    `Function`

    akb 中间件，匹配到规则后会立即执行该中间件

- type

    `string`

    路由类型，`static` 或 `dynamic`, 分别表示静态资源路由、动态路由。默认为 `dynamic`

#### 特定配置

##### 动态路由 (dynamic)

`options.type` 值为 `dynamic` 的路由规则

- controller

    `string`

- action

    `string`

例：
```javascript
'/:controller/:action': {
    controller: '{controller}',
    action: '{action}'
}
```

##### 如何映射到对应的文件

`action`默认值为`index`，如果没匹配到，默认等于`index`

查找对应的`js`文件分为两步

1. 先加载`${controllerDir}/${controller}.js`，如果`require`得到的结果中有对应名称的`action`，并且是个函数，则会执行该函数

```javascript
// 请求路径是 /foo/bar
// foo.js

module.exports = {
	async bar(ctx) {
		ctx.body = 'bar';
	}
};
```

2. 如果上面没找到对应的`action`，则会查找`${controllerDir}/${controller}/${action}.js`文件，并且`require`得到的需要是一个函数，否则会认为没找到

```javascript
// 请求路径是 /foo/bar
// foo/bar.js

module.exports = async function bar(ctx) {
	ctx.body = 'bar';
};
```

##### 静态资源路由 (static)

`options.type` 值为 `static` 的路由规则

- target

- root

- maxAge

- index

- dotfiles

- lastModified

- etag

- setHeaders

    `Function`

例：
```javascript
'/assets/(.*)': {
    type: 'static',
    target: '/assets/{0}',
    root: './public',
    // max age
    maxAge: 1 * 365 * 24 * 3600 * 1000,
    index: false,
    dotfiles: 'deny',
    lastModified: true,
    etag: false,
    setHeaders(ctx, path, stat) {
        console.log(path);
        ctx.set('name', 'pengxing');
    }
}
```

## 默认配置

```javascript
module.exports = {
    // 启用默认route
    enableDefaultRoutes: true,
    routes: {};
};
```
