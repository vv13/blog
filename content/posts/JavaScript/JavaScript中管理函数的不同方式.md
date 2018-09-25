+++ 
date = 2018-09-25T17:21:48+08:00
title = "JavaScript中管理函数的不同方式"
tags = ["JavaScript"]
+++

你能分清以下三种方法吗？

```
function Hello() {
  this.say = () => console.log("hello world by (1)");
}
Hello.say = () => console.log("hello world by (2)");
Hello.prototype.say = () => console.log("hello world by (3)");
```

在ES6中它们等价于下述代码：

```
class Hello {
  static say() {
    console.log("hello world by (2)");
  }
  say() {
    console.log("hello world by (3)");
  }
  constructor(value) {
    this.say = () => console.log("hello world by (1)");
  }
}
```

对于这三种方法的定义，我们暂且称其为：对象方法、类方法与原型方法，它们具有一些不同特征：

| 名称                 | 访问this作用域 | 通过实例调用 | 通过类名调用 |
| -------------------- | -------------- | ------------ | ------------ |
| 对象方法             | ⭕️              | ⭕️            | ❌            |
| 类方法（静态方法）   | ❌              | ❌            | ⭕️            |
| 原型方法（实例方法） | ⭕️              | ⭕️            | ❌            |

那么，使用不同的形式定义方法，它们会有什么区别呢？

### 类方法

类方法也称为静态方法，它与对象的实例是没关联的，不能访问实例this，我们可以将它视为存在于在类中的普通函数，它只能通过类名调用，而不能通过实例调用，例如：

```
function Hello() {}
Hello.say = () => console.log('hello world')
new Hello().say() // Error
Hello.say() // Correct
```

类方法通常用于定义与程序相关的工具函数、特定的输入输出、工厂模式等，它不会随着实例而初始化，也没有权限访问实例的作用域，因此在编写代码的时候，只要与实例无关的方法，都可以考虑定义为类方法。

### 原型方法

JavaScript的继承是基于原型的，因此原型方法至关重要，每个实例对象都有一个私有属性`__proto__`指向它的原型对象prototype，而原型对象是属于构造器的，它也有一个指向构造器的指针constructor，因此所有的原型方法也必须通过实例进行访问。它们之间的关系如下：

![](http://7xp5r4.com1.z0.glb.clouddn.com/18-9-25/92060693.jpg)

所有实例会共享原型方法，基于原型链的继承也会很方便，因此推荐大家在定义类的时候，尽可能的去使用灵活的原型方法。

### 对象方法

对象方法存在于构造函数中，当初始化实例时动态绑定到对象上，它与原型方法在使用上有一点相似之处，从我的理解角度来看，若可以使用类方法、原型方法时，不要使用对象方法，除非有特定的用途，因为它在每次创建对象时都会进行函数的创建工作，也不太符合OOP的思想。
