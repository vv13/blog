---
title: 简单聊聊浏览器JS事件触发机制
date: "2017-10-17"
tags: ['JavaScript']
---
## 原理

**事件捕获**

由网景最先提出，事件会从最外层开始发生，直到最具体的元素，也就是说假如父元素与子元素都绑定有点击事件，又互相重叠，那么先出发的会是父元素的事件，然后再传递到子元素。

**事件冒泡**

由微软提出，事件会从最内从的元素开始发生，再向外传播，正好与事件捕获相反。



这两个概念都是为了解决页面中事件流的发生顺序，w3c采取了折中的办法，制定了统一的标准：先捕获再冒泡。

## addEventListener

`addEventListen(event, function, useCapture)`添加事件的第三个参数默认值为false，即默认使用事件冒泡，若为true则使用事件捕获的机制，以下为示例：

![](/static/imgs/冒泡捕获.png)

当我们使用默认事件注册的时候，点击child元素时，会先后输出child，container，这就是事件冒泡机制：
```
container.addEventListener('click', () => console.log('container'))
child.addEventListener('click', () => console.log('child'))
```

将第三个参数设为true，点击child元素时，输出顺序就会变为container、child：
```
container.addEventListener('click', () => console.log('container'), true)
child.addEventListener('click', () => console.log('child'), true)
```

假若你希望点击child只打印child，不触发container的事件，我们就需要用到`stopPropagation`，它阻止捕获和冒泡阶段中当前事件的进一步传播：

```
container.addEventListener('click', () => console.log('container'))
child.addEventListener('click', (e) => {
  e.stopPropagation(); 
  console.log('child');
})
```

若你想要点击child只打印container，就需要进行捕获事件，并在container事件触发时进行阻止捕获：
```
container.addEventListener('click', (e) => {
  e.stopPropagation(); 
  console.log('container')
}, true)
child.addEventListener('click', () => console.log('child'), true)
```

与stopPropagation，还有一种事件方式叫做preventDefault，它的作用不是用于阻止冒泡，而是**阻止浏览器默认行为**，如a标签跳转，表单提交等。

## 事件委托

事件委托，又称为事件代理，通俗来讲是将元素的事件函数处理交由其他对象处理。它允许您避免向特定节点添加事件侦听器，我们这里所谈论的事件委托，与冒泡捕获流程相关，因此事件委托在此场景指的是子对象的处理事件交由父对象处理。

当你需要为一个动态的列表元素添加click事件时，若直接对列表项绑定事件，可能会重复注册很多个事件监听器。为了解决上述问题，我们可以利用事件委托的思想，在父级注册一个事件监听器，统一进行子元素的事件处理。

为了更好的说明，在这里举一个示例：
```
<ul class="list">
  <li class="item" data-id="1">1</li>
  <li class="item" data-id="2">2</li>
  <li class="item" data-id="3">3</li>
  <li class="item" data-id="4">4</li>
  <li class="item" data-id="5">5</li>
</ul>
```

为了给每一个`li`绑定上事件，若采用通常的方法，可能我们需要这样写代码：
```
document.querySelectorAll('.item').forEach(item => {
  item.onclick = e => handleClick(e.target.dataset.id)
})
```

但是列表数据可能会动态的变化，这样我们就避免不了动态的去注册事件，数量还可能很多，那有没有什么一劳永逸的方法呢？当然，让我们使用事件委托的方法，也就是将点击事件绑定到`ul`元素上：
```
document.querySelector('.list').onclick = e => {
  if (e.target.matches('li.item')) {
    handleClick(e.target.dataset.id)
  }
}
```

值得注意的是，`event.target`代表事件起源目标的引用，若要寻找当前注册事件对象的引用，请用`event.currentTarget`。
