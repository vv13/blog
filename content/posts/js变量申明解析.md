---
layout: post
title: js变量申明解析
date: 2016-12-09
tags: ['js']
---


var属性有多种需要注意的特性：
1. 无块级作用域
2. 不带申明类型默认为全局变量
3. 变量提升
4. 运行重新申明变量

#### 一、块级作用域

首先，js中申明的var变量或是方法，都没有块级作用域，只有函数作用域，最典型的示例为：

```
for (var i = 0; i < 100; i++){
  // ...
}
console.log(i); // 输入100
```

若我们使用es6的let与const，就不会出现这种问题。

#### 二、影响全局

若申明变量不使用变量类型，即使写在另一个函数作用域中申明的变量，也会直接将变量挂载在全局对象上，最容易引发此错误的地方在于使用with的时候，with可以延展一个对象的作用域链，将一个作用域的链拼接到执行上下文的作用域链中，相当于延长了当前作用域链：

```
const obj = {
  a: 'a',
  b: 'b',
};
with (obj) {
  console.log(a, b); // a b
  b = 3;
  c = 1;
}
console.log(obj.b, c); // 3 1
```

在with作用域中可以直接访问到b的值， 但是我们假如书写错误或是记漏变量名，如对c进行操作，则会创建一个全局变量c，这样不但会污染全局空间，也会对系统造成额外的开销，让我们来测试一段使用with语句进行访问的测试代码:

```
const testobj = { foo: 'bar' };
let value;
let starttime;
let endtime;
const times = 1000000;

starttime = new Date().getTime();
for (let n = 0; n < times; n++) {
  value = testobj.foo;
}
endtime = new Date().getTime();
console.log(`正常赋值操作:${endtime - starttime}ms`);

starttime = new Date().getTime();
with (testobj) {
  for (let n = 0; n < times; n++) {
    value = foo;
  }
}
endtime = new Date().getTime();
console.log(`with赋值操作:${endtime - starttime}ms`);

*****输出结果
正常赋值操作:25ms
with赋值操作:415ms
```

造成的原因是因为,在with下进行访问变量默认都是从一个对象中进行访问, 这样比直接访问多一个层级,自然速度就慢下来了，而且with语句不利于编译器进行静态分析，以此我们在代码中不要使用with。

#### 三、变量提升
大家肯定熟悉函数提升，可将函数定义放在调用代码之后：

```
a(); // haha
function a() {
    console.log('haha');
}
```

函数之所以会提升，还是因为编译器做静态分析时，会优先找到函数申明，再进行语法分词与解释器识别。

在js脚本内，可以在变量与申明式方法定义之前访问到其变量，值为undefined，这样的概念就叫做变量提升:

```
console.log(a); // undefined
var a = '1';
```

其实，这种提升只是为了设计和实现上更容易，并没什么优点，只不过新手应注意到这个细节。

只有var变量存在变量提示，而let与const都不会存在变量提升，并且，它们会带来一个特性：`暂时性死区`。

> 暂时性死区：有let存在的区域，它所申明的变量就会绑定这个区域，不再受外部作用于的影响,在块级作用域中let变量声明之前的区域都称谓它的死区。

这里有一个例子：

```
var a = 1
if(true){
    console.log(a) //ReferenceError
    let a = 2
}
```

变量提升还会造成一种问题，那就是内层变量会覆盖外层变量的值：

```
var tmp = new Date();

function f() {
  console.log(tmp);
  if (false) {
    var tmp = "hello world";
  }
}

f(); // undefined
```

#### 四、全局对象属性
全局对象是最顶层的属性，在浏览器中指window对象，在node中指代global对象。在以往的设计中，未申明的对象自动成为全局window的属性，这样就没法再编译时报出变量未申明的错误，而es6为了改变这一点，为了保持兼容性，var和function命令声明的全局变量依旧是全局变量；另一方面，let、const、class明亮声明的全局变量，不属于全局对象的属性。也就是说，全局变量将逐步与全局对象的属性脱钩。

```
(function(){
  a = 3
})()
var b = 2
console.log(window.a, window.b) //打印3,2，全局变量自动成为全局对象的属性

let c = 123
const d = 456
console.log(window.c, window.d) //undefined*2, es6的属性将与全局对象脱钩
```

#### 总结
在理解传统变量的基础下，应该多使用let、const等新的属性来申明变量，这是js语言的一种进化。
