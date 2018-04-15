---
title: "js继承小结"
date: 2018-04-16T00:52:54+08:00
tags: ['js']
---

## 重写原型链

初始化父类实例，将实例赋予给子类的原型链，这样一来，新原型不仅具有父类的所有属性和方法，而且内部还有一个`__proto__`指针指向父类的原型，这种方法称之为**类式继承**，代码如下：

```
function SuperClass() {}
function SubClass() {}
SubClass.prototype = new SuperClass()
```

使用这类继承需要注意以下特性：

1. 使用子类创建的实例，constructor会指向父类，这是因为子类prototype被替换为父类的prototype了
2. 引用类型的值会被所有实例共享

## 借用构造函数

将初始化属性与方法定义在父类中，在子类构造函数中使用call()调用父类的构造函数，这样父类的所有实例方法就会赋予给子类实例，这样可以解决引用类型共享问题：

```
function SuperClass() {}
function SubClass() {
    SuperClass.call(this)
}
```

如果仅靠借用构造函数，方法在构造函数中定义而非原型链，那么函数复用就无从谈起了，所以说借用构造函数很是很少单独使用的。

## 组合继承

这种方法结合了以上两种的，核心思想为使用原型链实现对原型属性和方法的继承，通过借用构造函数实现对实例属性的继承：

```
function SuperClass() {}
function SubClass() {
    SuperClass.call(this)
}
SubClass.prototype = new SuperClass()
SubClass.prototype.constructor = SubClass
```

组合继承避免了以上两种的缺点，因此成为JavaScript最常用的继承模式之一。他的缺点是会调用两次父级的构造函数，一次在初始化父类实例赋予给子类原型时，第二次在执行子类的构造函数时。

## 原型式继承

它通过创造一个临时的构造函数，基于已有对象的原型链创建新的对象：

```
function createOjbect(obj) {
    function F() {}
    F.prototype = obj
    return new F()
}
```

本质上是对已有对象进行了一次浅拷贝，这类方法我们现可通过Object.create()来实现。

## 寄生式继承

寄生式继承指的是在继承函数中，在内部通过某种方式来修改对象，最后再返回此对象，由于过程和工厂函数类似，并不暴露给外部，所以称之为寄生：

```
function createAnother(obj) {
    const newObj = Object.create(obj)
    newObj.b = '2'
    return newObj
}
```

使用寄生式继承来为对象添加函数，会因为做不到函数复用而降低效率，这一点与借用构造函数类似。

## 寄生组合式继承

通过借用构造函数来继承属性，原型链的混成形式（创建父类原型的一个副本直接赋值给子类原型）来实现继承：

```
function inheritPrototype(subClass, superClass) {
    const prototype = Object(superClass.prototype)
    prototype.constructor = subClass
    subClass.prototype = prototype
}
function SuperClass() {}
function SubClass() {
    SuperClass.call(this, name)
}
inheritPrototype(SubClass, SuperClass)
```

## 多继承

extend方法大家都听说过，核心实现就是对对象中的属性的一个个进行复制，以下方法只实现了浅复制，若需要深复制也简单，就是对引用类型再执行一遍extend的过程：

```
function extend(target = {}, source) {
    for (const property in source) {
        target[property] = source[property]
    }
    return target
}
```

实现了单个extend复制，其实多继承也就非常简单了：

```
function mixExtend(target = {}, ...args) {
    args.forEach(e => extend(target, e))
    return target
}
```

