---
title: "CSS子类选择器"
date: 2018-04-17T14:36:37+08:00
---

## nth-child和nth-of-type之间的差异

- p:nth-child(n)：`选取元素为父级的第n个子元素，并且类型为p标签`
- p:nth-of-type(n)：`选取元素为父级的第n个p标签`


举个例子：

```
<div class="wrap">
	<h1>标题</h1>
	<p>段落1</p>
	<p>段落2</p>
	<p>段落3</p>
	<p>段落4</p>
</div>
```

当我们想给段落1设置为红色，如果使用`p:nth-child(1) { color: red}`，其实是选不了段落1的，因为段落1属于父级的第2个子元素，改为nth-of-type即可选中。

在实际编码中，往往nth-of-type使用较多，因为不容易造成误解。

## 范围选取

还是以上述html代码为例子，我们可以使用nth-of-type时进行一些范围选取(用法同nth-child)。

#### 特定元素(n)

第一个元素的索引为1，n代指选取第几个元素。

```
p:nth-of-type(2) {display: none}
effect：段落2
show：段落1、段落3、段落4
```

除了指定特定的数字，我们也可直接使用n，n代表的是元素的全部索引，**2n表示索引为2的倍数**，3n同理。

#### 基偶选择(odd、even)

odd为基数、even为偶数。

```
p:nth-of-type(even) {display: none}
effect：段落2、段落4
show：段落1、段落3
```

#### 正向选择(n + ?)

选取从第？个元素开始到最后的集合。

```
p:nth-of-type(n + 3) {display: none}
effect：段落3、段落4
show：段落1、段落2
```

#### 负向选择(-n + ?)

选取第1个到第？个元素的集合。

```
p:nth-of-type(-n + 3) {display: none}
effect：段落1 ~ 段落3
show：段落4
```

#### 范围选择(正负选择组合)

同时使用正向与负向，即可选取合理的范围。

```
p:nth-of-type(n + 2):nth-of-type(-n + 4) {display: none}
effect：段落2 ~ 段落4
show：段落1
```

上述所有选择器都可以以这样的形式组合。

## 其他伪类选择器

#### first-child、first-of-type、last-child、last-of-type

选取第一个子元素、第一个指定类型的子元素、最后一个子元素、最后一个指定类型的子元素。

#### not选择器

通过:not进行包裹，我们可以进行更复杂的选择，比如:not(:nth-child(2))，选取除了第2个元素的所有元素。
