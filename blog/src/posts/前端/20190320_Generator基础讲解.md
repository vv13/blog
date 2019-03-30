---
title: 'Generator基础知识'
date: '2019-03-20'
tags: ['前端']
---

## 一个栗子
Generator函数是ES6提供的一种异步编程解决方案，它语法行为与传统函数不同，我们先来看一个使用Generator书写的Fibonacci函数的示例：
```
function* fibonacci(n) {
  let current = 0;
  let next = 1;
  while (n-- > 0) {
    yield current;
    [current, next] = [next, next + current];
  }
}
```

**费波那契数列由0和1开始，之后的费波那契系数就是由之前的两数相加而得出**。而我们上面的生成器参数n即代表需要计算到第几个序列：
```
const test = fibonacci(3);

console.log(test.next()); // {value: 0, done: false}
console.log(test.next()); // {value: 1, done: false}
console.log(test.next()); // {value: 1, done: false}
console.log(test.next()); // {value: undefined, done: true}

for (item of fibonacci(3)) {
  console.log(item) // 0, 1, 1
}
```

通过以上实践，可以简单总结出生成器的几个特点：
- 生成器函数在调用时不会立即执行，而是返回一个遍历器对象。
- 生成器中每个yield代表一个新的状态，通过遍历器对象的next()方法执行并返回结果，返回对象结构为：`{value: any, done: boolean}`。
- 遍历器Iterator可由`for ... of`执行。

## Generator生成器
Generator生成器与普通函数相比具有2个特征：
1. function与函数名之间有一个`*`。
2. 函数内部使用`yield`表达式。

当在调用生成器时，它不允许使用new关键字，也不会立即执行，而是返回一个`Iterator`对象，允许通过遍历器、`for...of`、解构语法等表达式执行。

每一个 yield 表达式，会使 Generator 生成一种新的状态，并转交控制权给外部函数，此时我们需要调用遍历器对象的`next`方法，才能使 Generator 继续执行。需要注意的是，Generator函数内部如果不存在`yield`表达式，它也不会立即执行，而是需要手动使用`next`方法触发：
```
function* test() { console.log('hello') }
const fn = test(); // 没有任何输出
fn.next(); // hello
```

Generator函数结束的标志为 return，return 返回的值也会作为next方法返回对象的value，而此时 done 属性为：true（如果函数体内无 return 关键字，则会执行到函数结束，默认返回值为undefined）。

## yield表达式
yield表达式用于定义Generator不同的内部状态，它同时作为函数暂停的标志，将执行权交给外部的其他函数，并将 yield 关键字紧邻的表达式作为接下来遍历器的`next()`方法返回的对象的value键值。外部函数在调用了`next()`方法以后，Generator才得以恢复执行：
```
function* test() {
  yield 'hello'
  yield 'world'
  return '!'
}

const executer = test();
executer.next(); // {value: "hello", done: false}
executer.next(); // {value: "world", done: false}
executer.next(); // {value: "!", done: true}


for (item of test()) { console.log(item) } // hello world

```

return与yield都能使函数停止执行，并将后面的表达式的值作为返回对象value传递出去，区别在于return是函数结束的标识，不具备多次执行的能力，返回的值也不能作为迭代对象使用（迭代器如果判断 done 标识为true，则会忽略该值)。

那我们可以在生成器中调用生成器吗？最开始尝试时可能会这样写：
```
function* hello() {
    yield 'hello'
    yield world()
}

function* world() {
    yield 'world'
}

for (item of hello()) { console.log(item) }
// hello
// world {<suspended>}
```

第二个迭代器的值返回的是一个新的Generator，它按照原样返回了，并没有按照我们预想中执行。为了在一个Generator函数里执行另一个Generator，此时就需要使用`yield*`表达式：
```
function* hello() {
    yield 'hello'
    yield* world()
}

function* world() {
    yield 'world'
}

for (item of hello()) { console.log(item) }
// hello
// world
```

`yield*`语句后面能接生成器对象或是实现了Iterator接口的值（字符串对象、数组对象等），它的作用就像是将生成器对象进行了`for...of`遍历，将每一个遍历到的对象传递到当前的生成器中执行yield，举一个示例：
```
function* example() {
  yield 'hello';
  yield* ['world'];
  yield* test();
  yield* '??';
}

function* test() {
  yield '!';
}

// example函数等同于
function* example() {
  yield 'hello';
  for (item of ['world']) {
    yield item;
  }
  yield '!'
  for (item of '??') {
    yield item;
  }
}
```

## Iterator遍历器
通过以上对Generator函数的介绍，我们对Iterator有了一个初步的了解，Generator函数在运行后，会生成一个遍历器对象，再由`for...of`语法或是解构函数对Iterator进行消费。其实Iterator不仅仅应用于Generator，它其实还是一种通用的接口规范，为不同的数据结构提供统一的访问机制。

ES6规定，Iterator接口部署在对象的`Symbol.iterator`上，凡是实现了这一属性的对象都认为是可遍历的（iterable），原生具备Iterator接口的数据结构有：
- Array、String
- Set、Map
- TypedArray、NodeList

因此对一个字符串来讲，我们可以手动获取到它的遍历器对象，并进行循环打印每一个字符：
```
const strs = 'hello world'
for (str of strs[Symbol.iterator]()) { console.log(str) }
```

除以上原生实现了Iterable数据结构以外，我们还可以自己定义任意对象的`Symbol.iterator`属性方法，从而实现Iterable特性，该属性方法具备以下特征：
- 函数不需要任何参数，要求返回一个`Iterator Object`
- 在`Iterator Object`中，存在一个`next()`方法，该函数总是返回一个`{value: any, done: boolean}`对象，`done`默认值为`false`，`value`默认值为`undefined`：
- `value`可以是任意值
- `done`为`true`，表示迭代器已经执行到序列的末尾；`done`为`false`表示迭代器还可以继续执行`next()`方法并返回下一个序列对象

实现Iterator接口有很多种方法，不论你的数据结构为类还是对象，我们只要保证[Symbol.iterator]属性方法及其返回的数据规范即可，以下为自定义迭代器的示例：
```js
// 使用生成器的方式，推荐使用
const obj  = {
  [Symbol.iterator] = function* () {
    yield 'hello';
    yield 'world';
  }
}

// 使用纯函数的方式定义返回对象及next方法
const obj = {
  [Symbol.iterator]: () => {
    const items = ['hello', 'world'];
    let nextIndex = 0;
    return {
      next() {
        return nextIndex < items.length
          ? { value: items[nextIndex++] }
          : { done: true };
      }
    };
  }
};
for (item of obj) { console.log(item) }
```

## next()、throw()与return()方法
这三种方法都属于Generator的原型方法，通过其对象进行调用，目的是让Generator恢复执行，并使用不同语句替换当前yield标志所在的表达式：
- `next(value)`，将表达式替换为value，next函数主要用于向生成器内部传递值，从而改变生成器的状态。
- `throw(error)`，将表达式替换为throw(error)，throw方法会将Error对象交由生成器内部处理，若生成器无法处理则会又将错误抛出来，此时会中断生成器的执行。
- `return(value)`，将表达式替换为return value，return方法用于中断生成器的执行。

若要一一举例，篇幅可能会非常长，因此在这里举一个包含这三种语句的示例：
```
function* test() {
  const flag = yield 'does anybody here';
  if (flag) {
    try {
      yield 'could you sing for me?';
    } catch (e) {
      if (e.message === 'sorry!') {
        yield 'I can teach you';
      } else {
        throw e
      }
    }
    yield 'maybe next time';
  }
}

const executer = test();
executer.next(); // {value: 'does anybody here?'}
executer.next(true); // { value: 'could you sing for me ?' }
executer.throw(new Error('sorry!')); // {value: 'i will teach you'}
executer.return('thank you'); // {value: "thank you", done: true}
```

函数有几点需要解释：
- 当生成器小张询问是否有人在这里时，我们需要通过next(true)进行回应，以此来改变它的状态。
- 小张喜欢听音乐，因此他会询问你能否为他唱首歌，假设你不会唱，你可以通过throw抛出一个错误，说实在是抱歉，这时小张会热情的教你唱歌；如果你的回答是“No Way!”，那么小张就会当场崩溃。
- 你同意向小张学习并唱歌给他听，可以通过return方法向他表示感谢，此时对话就可以终止了。

## 参考资料
- [ECMAScript 6入门](http://es6.ruanyifeng.com/#docs/generator)
- [Iteration protocols - JavaScript \| MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)
