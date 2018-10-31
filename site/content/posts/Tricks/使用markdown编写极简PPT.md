---
title: "使用markdown编写极简PPT"
date: 2018-04-07T19:54:45+08:00
tags: ['tricks']
---

总有人喜欢用markdown编写一切文档类型的东西，当然PPT也不能例外，于是就有了以下的这篇用来安利并节约你使用时间的文章。

## reveal.js

[reveal.js](https://github.com/hakimel/reveal.js)是一个用于生成简单的演示文稿的js框架，它支持嵌套幻灯片、markdown格式、pdf导出、演讲笔记等操作，界面也是响应式的，不止于此，它也有在线的全功能可视化编辑器[平台](https://slides.com/)，介绍这么多，不如简单来看一看reveal.js的操作方法吧。

## 基本使用

本文不会介绍文稿的配置信息，详细配置与说明请参照项目README。

首先，通过以下脚本运行模板项目：

```
$ git clone https://github.com/hakimel/reveal.js.git my-reveal-ppt
$ cd my-reveal-ppt
$ npm install
$ npm start
```

在这一步之前，你应该可以通过`http://localhost:8000`访问演示文稿了。接下来开始引入markdown文件：

```
		<div class="reveal">
			<div class="slides">
                <section
                    data-markdown="./md/test.md"  
                    data-separator="^\n----\n"  
                    data-separator-vertical="^\n--\n"  
                    data-separator-notes="^Note:"  
                    data-charset="utf8">
                </section>
			</div>
		</div>
```

其中各属性代表的意思是：

- data-markdown：外部markdown文件的链接地址
- data-separator：水平幻灯片分页符
- data-separator-vertical：垂直幻灯片切换分隔符
- data-separator-notes：演讲者笔记
- data-charset：文件编码

## More

#### 演讲笔记

注意到我们在上一章节配置了`data-separator-notes`，可在markdown文件中通过`Notes:`标签写的内容却不会在ppt中展示出来，只有通过配置`showNotes: true`才会始终出现在PPT的边栏上，真的是这样么？按s即可打开演讲者文稿，不仅可以展示下一篇，还能看到Notes。

#### 修改主题

在`css/theme/source`任意复制一个当前使用的主题为test.scss，目录里的文件会自动编译为css，因此直接在html中移入`css/theme/test.css`就行了。另需改变theme中引入的外部文件，同理复制一份，换一个引用名称即可。

#### 转换为PDF

通过浏览器内置的打印不靠谱，推荐使用[decktape](https://github.com/astefanutti/decktape)。简单用法请参照以下命令：

```
$ npm install -g decktape
$ decktape reveal http://localhost:8000/index.html index.pdf
```

#### Codepen

之前通过将异步脚本放进index.html进行加载，后来发现markdown可直接引入iframe形式的codepen代码。
