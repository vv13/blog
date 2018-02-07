---
title: 异步编程中的thunk函数
date: 2017-08-23
tags: ['js']
---

## 什么是Thunk

Thunk英译即转化程序，第一次遇见这个名词是在使用redux-thunk的时候，只知道是做为异步和同步中间件来使用，并未深入的了解，接下来发现koa的框架中是因在koa1的概念中设计到了它，故学习了一番，因此做一个简单的总结。

写一个简单的函数，用于读取package.json的信息：

```
fs.readFile('package.json', (err, data) => {
    if (err) throw err;
    console.log(data.toString())
})
```

在某些情况下，我们需要将参数进行包装一下，比如在koa1的生成器中间件中，我们必须将函数包装成有且只有一个callback函数，这样koa中间件才能识别函数：

```
const app = new Koa()

app.use(function*(next) {
    const data = yield readFileThunk('package.json')
    console.log(data)
    yield next
})

function readFileThunk(path, cb) {
    return function(cb) {
        fs.readFile(path, (err, data) => {
            if (err) throw err
            cb(null, data.toString())
        })
    }
}
app.listen(3000)
```

通过访问端口，我们看到了正确的打印信息，将正常函数包装为上述函数，即称之为thunk函数。**Thunk函数将多参数函数替换成了单参数版本**，与高阶函数、柯里化思想类似。播个小插曲，在koa2中，中间件写法更迭成了async/await，其原理也是基于generator进行又一次封装，代码为：

```
app.use(async(ctx, next) => {
    const data = await readFileWrap('package.json')
    console.log(data)
    await next()
})

function readFileWrap(path, cb) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) throw reject(error)
            resolve(data.toString())
        })
    })
}
```

我们接下来自己实现一个简易的thunk工具方法，思路如下：

1. 一共三个执行函数，第一层函数传入主函数方法fn，并返回一个带有fn方法的闭包
2. 第二层函数传入参数args，然后返回一个仅需传入回调函数供外部执行的方法
3. 第三层函数传入一个回调函数cb, 然后执行主程序

```
function thunkit(fn) {
    return function() {
        var args = Array.prototype.slice.call(arguments) 
        return function(cb) {
            args.push(cb)
            return fn.apply(this, args)
        }
    }
}
```

在实际使用中，往往业务场景更复杂，因此推荐使用node-thunkify库，源代码也只有28行，请看下一节。

## thunkify源码解析

```
function thunkify(fn){
  assert('function' == typeof fn, 'function required'); // 是否为函数

  return function(){
    var args = new Array(arguments.length); 
    var ctx = this; // 绑定函数的上下文对象
	
	// 初始化了一个新的数组，这种写法兼容性更强，不像本文上面直接用的.slice方法进行拷贝数组
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function(done){
      var called; // 记录是否执行回调，只允许执行一次

      args.push(function(){
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args); // 调用参数列表
      } catch (err) {
        done(err); // 返回错误
      }
    }
  }
};
```

源代码已经够简单了，想也无需多说明，**重要的是函数本身的思想与灵活的去运用**。

### 参考资料

- [node-thunkify](https://github.com/tj/node-thunkify)

- [阮一峰-Thunk 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/thunk.html)

- [experiments-with-koa-and-javascript-generators](http://blog.stevensanderson.com/2013/12/21/experiments-with-koa-and-javascript-generators/)
