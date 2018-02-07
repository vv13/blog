---
layout: post
title: python变量作用域
date: 2016-12-25
tags: ['python']
---

class比作整个屋子，def为卧室，class外面的部分就是小区环境。

#### 首先测试房子(class)与公共设施变量(globals)之间的关系

```
# encoding: utf-8

PUBLIC_FACILITIES = u"公共厕所"

class House():
    print PUBLIC_FACILITIES
    PUBLIC_FACILITIES = '改造'

if __name__ == '__main__':
    test = House()
    print PUBLIC_FACILITIES

```

测试结果：

```
公共厕所
公共厕所

***Repl Closed***
```

房屋的拥有者可以使用小区内的公共设施。由此可知class内部可以访问外部的变量，但不能进行修改，在class中执行改造命令的效果就是新建了一个类局部变量变量，在访问域中覆盖了全局变量的访问域。

#### 测试房子(class)与房间(def)的关系

```
# encoding: utf-8

class House():
    SOFA = u'真皮沙发'
    def room(self):
        # print SOFA # 无法直接访问外部变量，取消注释会报错
        print self.SOFA
        self.SOFA = '布质沙发'


if __name__ == '__main__':
    test = House()
    test.room()
    print test.SOFA, House.SOFA
```

测试结果：

```
真皮沙发
布质沙发 真皮沙发

***Repl Closed***
```

大家可以理解这样一个现象：无法将客厅的沙发放到卧室(卧室太小)，只能重新订制一个沙发，或是在客厅里去使用。当def方法中不存在与class类相同名称的变量时，def方法体中可以通过self访问到class的类变量， 但是当执行self.SOFA = Something时，新建了一个变量实例变量，并没有修改到class中的类变量， 而变量的搜索时先从局部变量进行查找，如果没有找到再查找全局变量，所有说局部变量优先访问到。

#### 总结
用python写class时务必区分类变量、实例变量、全局变量，  访问全局变量须申明`global variable`， 访问类变量要接上类名，如`class_name.variable`, 还需要注意的时while、for、try语句并不具有独立的命名空间，这与java的规则是不一样的。
