---
title: d3-intro
date: 2017-10-24
tags: ['web']
---
D3.js是一个JavaScript库，它可以通过数据来操作文档。D3可以通过使用HTML、SVG和CSS把数据鲜活形象地展现出来。D3严格遵循Web标准，因而可以让你的程序轻松兼容现代主流浏览器并避免对特定框架的依赖。同时，它提供了强大的可视化组件，可以让使用者以数据驱动的方式去操作DOM。

D3允许将数据绑定到DOM中，然后基于数据驱动去变化DOM。例如可以用数字数组来生成html的表格，或者使用相同数据创建一个平滑响应的SVG条形图。

## 选择器

使用W3C DOM API十分繁琐，因此D3使用selections，一种声明式的方式来随意的操纵节点。

例如原dom有操作方式如下：

```
var paragraphs = document.getElementsByTagName("p");
for (var i = 0; i < paragraphs.length; i++) {
  var paragraph = paragraphs.item(i);
  paragraph.style.setProperty("color", "white", null);
}
```

使用d3的方式来重写：

```
d3.selectAll("p").style("color", "white");
d3.select("body").style("background-color", "black")
```

打开调试的页面，即可看到效果。d3的选择器也是由标准[W3C Selectors API](https://www.w3.org/TR/selectors-api/)构建的，因此在各种现代浏览器中原生支持。d3提供了丰富的方法来改变节点：设置属性、样式、注册事件、删除添加节点等，这些可以满足大多的需要。

## 动态特性

d3就像dom的框架jquery一样，包含有许多属性、样式的函数方法，它不仅仅简化了方法，组合起来会惊人的强大。d3还提供了许多内建可复用的函数，如区域图形、线和饼图。

例如，使偶数段落颜色值随机：

```
d3.selectAll('p').style('color', function (d, i) {
  return i % 2 ? '#fff' : 'hsl(' + Math.random() * 360 + ',100%,50%)'
})
```

计算属性通常用于绑定数据，数据规定为一个数组，每个元素都会通过第一个参数由默认顺序传递进入选择器函数，例如我们可以使用一个数组去动态设置字体大小：

```
d3.selectAll("p")
  .data([4, 8, 15, 16, 23, 42])
    .style("font-size", function(d) { return d + "px"; });
```

一旦数据被绑定到dom，那么在之后的操作中可以不用再一次绑定数据，d3将会检测先前绑定的数据，因此允许重新计算属性而不用重新绑定。																																																																																	

## Enter 和 Exit

Enter可用于为新来的数据创建新的节点，当数据绑定到了选择器上时，每个结点都会有对应的数据，如果节点少于数据，那么**额外的数据就会从enter选择器进入**，在这里面就可以进行添加等操作，而Exitremove用于。

如果没有使用Enter和Exit，会自动的选择存在存在并且匹配数据的节点进行更新操作，而exit用于退出节点，remove用于删除节点。

D3让你基于数据对dom进行变化，这些操作包括了添加与删除，也允许改变响应事件、动画事件或是从第三方库异步通知，甚至支持混合的方式，从服务器上渲染，然后更新到客户端上。

## 转换

D3不会引入新的视觉表现，而是直接来源于Web标准：HTML、SVG和CSS。因此无需考虑兼容性问题，因为所有D3使用的技术都是浏览器内置的元素与标准。

D3专注于从自然到动画的转化，随着时间逐渐插入样式和属性，中间过程可以使用如“elastic”, “cubic-in-out” 和“linear”来控制补片。

通过仅修改实际改变的属性，D3减少了开销，并允许在高帧速率下实现更大的图形复杂度。D3还允许通过事件对复杂过渡进行排序。而且，您仍然可以使用CSS3转换; D3不会取代浏览器的工具箱，而是以更容易使用的方式展开。



## 示例

代码如下：

```
// css
.chart div {
  font: 10px sans-serif;
  background-color: steelblue;
  text-align: right;
  padding: 3px;
  margin: 1px;
  color: white;
}

// html
<div class="chart">
</div>

// js
d3.select(".chart")
  .selectAll("div")
  .data([30, 86, 168, 281, 303, 365])
    .enter()
    .append("div")
    .style("width", function(d) { return d * 2 + "px"; })
    .text(function(d) { return '$ ' + d; });

```

效果图：

![](http://qn.vv13.cn/17-10-24/89023358.jpg)

其中，api方法如下：

- select，选中某一个元素
- selectAll，选中其中的div元素
- data，传入数据
- enter，对于额外数据进行插入操作
- append，插入div
- style，设置宽度，回调函数d代表data对应的值
- text，修改插入元素内的文字
