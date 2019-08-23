---
layout: post
title: nodejs中exports与module.exports的区别
date: 2016-12-25
tags: ['JavaScript']
---

在nodejs中常常会使用require()加载模块，为了使得文件模块化，将其的变量与方法提供给别的模块使用，就会使用到exports与module.exports，可是如何区分它们呢？ 在此简单的记录一下。

### require()的返回值
require()返回的是module.exports指向的内容而不是exports的，我们将两个变量分别赋予新的内存地址，以此来进行观察：

test.js:

```
module.exports = function(){
    console.log('I\'m module.exports')
}
exports = function(){
    console.log('I\'m exports')
}
```

通过`var a = require('./test')()`即可看到打印的函数为module.exports，因此可以确定exports是module.exports的一个指针，不清楚指针的具体内容的接着往下看。

### exports是module.exports的一个指针
假设有两个变量，`var a={name:'name1}, var b = a;`，b指向a的内存区域，如果执行`b.name='name2'`，我们通过打印a.name可以看到其值也为name2，这就说明两个变量共同拥有一块内存区域，并且可以共同对区域进行修改。

可如果我们执行`a = {}`或者`b = {}`之后，两个变量就各自管理自己的内存空间了，不再有关联，所以在nodejs中两者一共有几种用法：
1. module.exports存在的话，exports或是exports.xxx就会失效，因此此刻两者已经不是管理共同的内存区域。
2. exports只能通过exports.xxx这种形式进行使用，否则exports={}会指向新的内存区域，不能被require()加载。
3. exports.xxx与module.exports.xxx等价且可以共同存在。
