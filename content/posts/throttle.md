---
title: 什么是函数节流
date: 2017-10-14
tags: ['JavaScript']
---
## 什么是函数节流

避免同一时间函数调用多次，消耗大量的性能，比如resize事件、input事件等，通过设定函数执行时间间隔与延时，来达到优化的效果，应用最多的如lodash的debounce防抖函数了吧。

## 代码实现

首先通过setTimeout实现一个简单的版本，原理为使用clearTimeout刷新定时器即可：

```
function throttle(fn, delay, ...args) {
  let timer = null
  return function() {
  	clearTimeout(timer)
  	timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
```

测试函数：

```
const log = throttle(console.log, 300, 1)
for (let i = 0; i < 100; i++) {
  log() // 只会打印一次
}
```



这样的函数有时还无法完成要求，比如在拖拽一个元素时，直接使用此节流函数会造成拖拽的时候无法移动，等拖完了就直接闪到终点去了，因为函数一直在定时器内不断刷新，只有到最后才执行了，因此需要对此函数改进一下，多设定一个参数，即触发的时间间隔，这样即可保证函数的执行频率了。

```
function throttle(fn, delay, duration, ...args) {
  let timer = null
  let tStart
  return function() {
  	clearTimeout(timer)
  	const cStart = +Date()
  	if (!tStart) {
      tStart = cStart
  	}
  	if (cStart - tStart >= duration) {
      fn.apply(this, args)
      tStart = cStart
  	} else {
      timer = setTimeout(() => {
      	fn.apply(this, args);
      }, delay)
  	}
  }
}
```

## 参考资料

- [浅谈javascript的函数节流](http://www.alloyteam.com/2012/11/javascript-throttle/)



