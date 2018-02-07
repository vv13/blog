---
layout: post
title: BEM规范
date: 2017-01-09
tags: ['tricks']
---

## 什么是BEM？
block(块)、element(元素)、modifier(修饰符)，是一种css命名方式，它让css类对开发者更加透明与易于维护。


## 语法
```
.block {} // 块
.block__element {} // 块所属元素
.block__element--modifier {} // 块所属元素的状态
```


## 与sass结合
### &
通过&会直接引用父元素，嵌套使用&可以增强可读性：
```
.block {
  &__element1 {}
  &__element2 {}
}
```

### extend
如下html：
```
<ul>
  <li class="nav__item"></li>
  <li class="nav__item"></li>
  <li class="nav__item--active"></li> <!-- 梦想 -->
  <li class="nav__item nav__item--active"></li> <!-- 现实 -->
</ul>
```

extend可以继承类的所有定义，于是可以这样消除冗余：
```
.nav {
  ...
  &__item {
    ...
    &--active {
      @extend .nav__item;
      ...
    }
  }
}
```

## css module...
css module确实能给react带来很好的css独立性，再也不用担心产生命名冲突，但通过实际编程，发现以下问题：
### 书写麻烦
使用css module引入的标签：
```
<div className={classnames(style['class1__child'], style['class2']}></div>
```

而使用import导入bem类会是这样的：
```
<div className="class1__child class2"></div>
```

### 测试
写过react测试的同学应该深有体会吧，运行测试时无法通过类名直接去选择，这样会绕了多少弯路啊～

### 编译工具
sass、less我是不想舍弃～


## TODO
1. BEM的优点
2. 补充说明
