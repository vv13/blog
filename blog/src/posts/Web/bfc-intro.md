---
title: css的BFC特性
date: 2017-10-23
tags: ['Web']
---

### 预备知识

**毗邻元素**

只要两个容器之间没有被非空内容、padding、border或clear隔开，那么就可以称作毗邻元素，父组件相对于其第一个子元素或最后一个子元素，只要没有相隔任何上述条件，也可称之为毗邻元素

**普通流(normal flow)**

在普通流中，元素按照其在HTML中的先后顺序至上而下布局，这个过程中，行内元素水平排列，直到当行被占满后换行，块级元素则会被渲染为一个新行，除非另外指定，否则所有元素默认都是普通流定位。

以下情况会脱离文档流而存在，分别是：`float: left`、`position: absolute`、`position: fixed`


### 什么是BFC

Block Formatting Context，块格式化上下文，拥有一套渲染规则来决定子元素将如何布局，以及和其他子元素的相互关系。

BFC可通过如下条件形成：

- 浮动元素、绝对定位元素
- 非块级盒子的块级容器(inline-blocks、table-cells、table-captions)
- overflow不为默认值visible

BFC的特性如下：

- 内部的Box会在垂直方向，从顶部开始一个接一个地放置
- Box垂直方向的距离由margin决定，属于同一个BFC的两个相邻Box会发生叠加
- 在BFC中，每一个Box的左外边缘，会触碰到容器的左边缘，右边也依然，即使存在浮动也如此
- 形成了BFC的区域不会与float box重叠
- 它是一个隔离的容器，容器内的子元素不会影响到外面的元素
- 计算BFC的高度时，浮动元素也参与计算

利用BFC的特性，我们可以用来解决诸如以下等问题。

### 消除外边距塌陷(margin collapsing)

在同一个BFC中，两个或多个毗邻的普通流中的块元素垂直方向上的margin会发生叠加，相邻块的外边距有时会被合并为单个外边距，取其中更大的值，这种行为称为外边距塌陷，发生此情况有一下几种情况：

**1. 相邻的兄弟姐妹元素**

```
<p style="margin-bottom: 30px;">这个段落的下外边距被合并...</p>
<p style="margin-top: 20px;">...这个段落的上外边距被合并。</p>
```

此时p的距离为30px，而不是预想的50px，在布局时需要注意。

**2. 父子元素**

```
<div class="parent" style="margin-top: 20px;">
  <p class="child" style="margin-top: 10px;">p的margin会被父元素的margin合并</p>
</div>
```

产生这种影响必须满足两个条件：

1. 第一个子元素的上边距和父元素的上边距会进行合并
2. 最后一个子元素的下边距会和父元素的下边距进行合并

当父元素的margin-top为0时，而子元素不为0，则整个区域都会具有子元素的外边距，这种情况称之为**子元素劫持**。给父元素设置`overflow: hidden`或是其他，触发了BFC特性即可解决。

**3. 空元素**

它的上下边距会自动合并为一个外边距，这作为外边距塌陷的一种特殊情况。

### 解决父元素塌陷

父元素塌陷指的是当子元素全为float，父元素高度为0这种情况，因为float元素不占据文档流(normal flow)空间，所以产生了塌陷，只需触发父元素的BFC特性即可解决，BFC会根据子元素的情况自动适应高度，包含浮动的子元素。

### 解决元素被浮动元素覆盖

浮动元素的毗邻节点会无视浮动的元素，尽量占满一行，这样就会被浮动元素所覆盖到，因此只需要把非浮动元素触发BFC，则会形成两列布局，从而不会被浮动元素覆盖。