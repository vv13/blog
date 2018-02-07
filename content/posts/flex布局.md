---
layout: post
title: flex布局
date: 2017-01-21
tags: ['web']
---

## 简介
flex即弹性盒子布局，它比传统的布局提供更大的灵活性，w3c组织在09年提出这个概念，目前已经广泛应用于支持各个浏览器。

它最大的特性是可以使子元素充分的利用容器的空间，当空间不足时也可进行收缩，以此来适应各种各样的屏幕大小，也能根据权重排列子元素的顺序。

设置容器为flex布局，只需要设置`display: flex`即可。它将具有以下特性：
1. 子元素float、clear、vertical-align将失效。
2. 存在主轴(默认为水平)与交叉轴，通过flex-direction可设置主轴的方向。

## 概念
![](/static/imgs/flex布局.png)
#### 轴线
+ 主轴: 它是flex子元素的排列方向，默认为水平向右，可根据flex-direction确定方向。
+ 交叉轴：垂直于主轴,确定子元素的垂直方向上的位置。

#### flex 属性：
+ flex-direction，设置主轴的方向
+ flex-wrap，项目是否多行显示
+ flex-flow，flex-direction与flex-wrap的缩写，默认为row nowrap
+ justify-content，项目在主轴上的对齐方式
+ align-items，项目在交叉轴上的对齐方式
+ align-content，多根轴线的对其方式，对只有一根轴线的无效

#### flex item属性：
+ order，项目的权重，数值越小排列越靠前
+ flex-grow，项目的放大比例，默认为0不放大
+ flex-shrink，项目的缩小比例，默认为1等比缩小，设置为0后不缩小
+ flex-basis，项目本身的大小，和width、height类似
+ flex，flex-grow、flex-shrink和flex-basis属性的简写
+ align-self，设置项目自身的对其方式，覆盖align-items属性

各项详细配置，请参照阮老师的[语法文章](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)。

## Usage
> [vv13.cn/flex-demo](http://vv13.cn/flex-demo)

文字不便描述，直接访问在线app示例吧，这里是[github地址](https://github.com/vv13/flex-demo.git)～
