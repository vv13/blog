---
layout: post
title: Koa源码分析
date: '2019-02-18'
tags: ['前端']
---

# Koa源码解析
Koa是一款设计优雅的轻量级Node.js框架，在这里和大家一起来学习其设计思想。

## 目录结构
首先将[源码](https://github.com/koajs/koa)clone到本地，可以看到Koa的源码只包含下述四个文件：
```
lib
├── application.js，
├── context.js
├── request.js
└── response.js
```

#### application
[application.js](https://github.com/koajs/koa/blob/master/lib/application.js#L104)为Koa的主程序入口文件，在package.json的main字段有定义。它主要负责HTTP服务的注册、封装请求相应对象，并初始化中间件数组并通过[compose](https://github.com/koajs/compose)方法进行执行。

#### context
[context.js](https://github.com/koajs/koa/blob/master/lib/context.js)的核心工作为将请求与响应方法集成到一个上下文(Context)中，上下文中的大多数方法都是直接委托到了请求与响应对象上，本身并没做什么改变，它能为编写Web应用程序提供便捷。

#### request
[request.js](https://github.com/koajs/koa/blob/master/lib/request.js)将HTTP的request方法进行抽象与封装，通过它可以访问到各种请求信息。

#### request
[response.js](https://github.com/koajs/koa/blob/master/lib/response.js)与request功能类似，它是对response对象的抽象与封装。

## 中间件
#### 示例
Koa引以为豪的有中间件系统(Middleware)了，相信大家都耳熟能详了，在这里还是先举一个最简单的例子来说明其原理：
```
const Koa = require('koa');
const app = new Koa();

app.use((ctx, next) => {
  console.log('enter 1');
  next();
  console.log('out 1');
});

app.use((ctx, next) => {
  console.log('enter 2');
  next();
  console.log('out 2');
});

app.use((ctx, next) => {
  console.log('enter 3');
  next();
  console.log('out 3');
});

app.listen(3000);
```

现在让我们来访问应用：`curl 127.0.0.1:3000`，可以看到以下输出结果：
```
enter 1
enter 2
enter 3
out 3
out 2
out 1
```

#### next是什么？

通过以上的结果进行分析，当我们执行`next()`的时候，可能程序的执行权交给了下一个中间件，next函数会等待下一个中间件执行完毕，然后接着执行，这样的执行机制被称为“洋葱模型”，因为它就像请求穿过一层洋葱一样，先从外向内一层一层执行，再从内向外一层一层返回，而next就是进行下一层的一把钥匙：

![onionmodal.png](./7a3e38e2.png)

#### 原理

聊完了理想，现在我们来聊现实。首先来看看app.use函数：
```
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this;
  }
```

整个函数只做了一件事情，将中间件函数添加到了实例中的middleware数组，其他的即是对类型进行校验，若不为函数则直接报TypeError，若为生成器则发出deprecated警告并使用koa-convert[注1]对其转化。

中间件在什么时候执行的呢？首先我们找到listen的回调函数：
```
const server = http.createServer(this.callback());
```
然后来看看这个神奇的callback函数：
```
  callback() {
    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
```

函数首先将中间件使用[koa-compose](https://github.com/koajs/compose)进行处理，那个compose到底是个什么呢？不如直接来看源码吧（省略掉了注释与类型检测）：
```js
function compose (middleware) {
  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

首先我们把目光放到`index`与`i`两个变量上，当执行执行`compose(middleware)`函数时，会返回一个闭包函数`distpach(0)`，闭包函数执行时，dispatch函数内部的判断逻辑如下：
1. 若i小于等于index 则报出错误：'next() called multiple times'。
2. 若i大于index时，将i赋予index，此时i与index相等。

逻辑很简单，但这样做的目的是什么呢？假若程序按着预期执行，每个中间件内部都执行next()，假若有3个中间件，那么当每次执行dispatch(i)时，到Line8之前index与i的值分别为：`-1/0, 0/1, 1/2`，可以看出i始终要大于index，index的闭包变量每次在执行完函数后都会加1，因此可以知道的是若同一个中间件执行了两次，index就会等于i，再执行一次index就会大于i，**由此可知，index的存在意义在于限制next能执行不超过1次。**

*Line9*到*Line11*用于取出middleware中的当前中间件，若数组为最大索引标识，则会将fn等于next函数，意味着将再执行一次越级的索引`i + 1`，由于取不到值，于是就执行到*Line11*返回Promise.resolve()。

当函数执行到*Line13*，则会运行当前中间件，并将是否执行下一个中间件dispatch(i + 1)的决定权传递到next参数，将运行结果返回，返回函数的运行结果的意义在于每次执行next的返回结果都是下一个中间件的执行结果的Promise对象。

#### 回到callback
让我们继续看callback函数等剩余逻辑：
```js
  callback() {
    const fn = compose(this.middleware);
    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
```

首先来看看*Line3*，因为Application继承与Emitter，故此方法是用于监听实例中的error事件的，当listenerCount的数值为0时，表示没有监听过，则注册监听函数。

接着生成一个handleRequest回调，当每个请求过来时，都会创建ctx上下文对象，并将中间件函数传入实例方法handleRequest，让我们来看看此时的处理函数：
```
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```

在这里多出了几个函数：
- [on-finished](https://github.com/jshttp/on-finished)，监听请求是否正常结束。
- `respond`， 处理当中间件执行完毕后的response对象，主要逻辑为响应码与响应体的转换，由于逻辑简单，在这里就不一一解析了。

#### 回到示例
回到示例，是否恍如隔日？现在的代码还困扰你吗？让我们稍作修改：
```
app.use((ctx, next) => {
  console.log('enter 1');
  next();
  console.log('out 1');
});

app.use((ctx, next) => {
  console.log('enter 2');
});

app.use((ctx, next) => {
  console.log('enter 3');
  next();
  console.log('out 3');
});
```

此时你能准确的知道执行结果吗？此时打印顺序为：`enter 1 -> enter 2 -> out 1`。因为只有next才是进入到下一中间件的钥匙。若再将程序改一改：
```
app.use(async (ctx, next) => {
  console.log('enter 1');
  next();
  console.log('out 1');
});

app.use(async (ctx, next) => {
  console.log('enter 2');
  await next();
  console.log('out 2');
});
```

此时执行结果为：`enter1 -> enter2 -> out 1 -> out2`，这你能答对吗？你不需要记住范式与结果，回想一下核心的compose函数：`return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))`，首先中间件全为async函数，若使用await next()，则会等待下一个中间件返回resolve状态才会执行此代码，如果某一个Promise中间件不使用await关键字呢？它会在主进程上进行排队等待，等到函数执行栈返回到当前函数后立即执行。对于此示例来讲，当进入到第二个中间件，遇到await关键字时，`console.log('out 2')`则不会再执行，而是进入到微任务队列中，此时主进程已无其他任务，则函数退出当前栈，返回到了第一个函数中，此时输出out 1，当第一个中间件执行结束后，事件循环才会将中间件2的微任务取出来执行，因此你见到了上述的输出顺序。

## 上下文
通过上述分析，我们了解到http.createServer中有一个callback函数，它不仅负责执行compose函数，也会调用`createContext`方法创建函数上下文，源码如下：
```
  createContext(req, res) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }
```

可以由这个函数得知，ctx对象包含了`context.js
request.js、response.js`的代码。通过访问req与res的源代码，大家可以发现在request与response对象中封装了许许多多http库的请求方法与各类工具函数，若对http底层实现感兴趣的小伙伴可以仔细读一下request与response文件，否则多查阅几遍官网文档，大概了解其中的api即可。

而对于context.js，其实十分简单，它也封装了部分工具方法，并使用[node-delegates](https://github.com/tj/node-delegates)进行委托方法与属性，对于此类方法的实现，估计koa3会将这一部分重构为Proxy吧。

## 注解
#### 1. koa-convert转化
在Koa版本号为1.x时，中间件都是使用Generator实现的，因此可以通过官方提供的[koa-convert](https://github.com/koajs/convert/blob/master/index.js)临时对其进行转化与兼容，基本用法为：
```
function * legacyMiddleware (next) {
  // before
  yield next
  // after
}
app.use(convert(legacyMiddleware))
```

然后打开源码发现，核心代码大概如下：
```
function convert (mw) {
  return (ctx, next) => co.call(ctx, mw.call(ctx, createGenerator(next)))
}
```
convert函数将生成器通过co进行包装为Promise函数，在ctx上下文进行执行，并传入next函数。

## 总结
凡是涉及到原理性的东西，感觉自己很难避免自顾自说，用图片进行可视化的方式会更加直观，易于理解，希望之后自己多多使用图片来阐述原理。

通过源码分析，我们知道了Koa的核心思想建立于中间件机制，它是一个设计十分简洁、巧妙的Web框架，扩展性极强，egg.js就是建立于Koa之上的上层框架。
