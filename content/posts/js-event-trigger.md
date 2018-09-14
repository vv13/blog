---
title: js事件触发机制
date: 2017-10-17
tags: ['JavaScript']
---
## 原理

**事件捕获**

由网景最先提出，事件会从最外层开始发生，直到最具体的元素，也就是说假如父元素与子元素都绑定有点击事件，又互相重叠，那么先出发的会是父元素的事件，然后再传递到子元素。

**事件冒泡**

由微软提出，事件会从最内从的元素开始发生，再向外传播，正好与事件捕获相反。



这两个概念都是为了解决页面中事件流的发生顺序，w3c采取了折中的办法，制定了统一的标准：先捕获再冒泡。

------

![](http://7xp5r4.com1.z0.glb.clouddn.com/17-10-17/68340524.jpg)

`addEventListen(event, function, useCapture)`添加事件的第三个参数默认值为false，即默认使用事件冒泡，若为true则使用事件捕获的机制，以下为测试代码：

```
container.addEventListener('click', () => console.log('container'), true)
child.addEventListener('click', () => console.log('child'), true)
// 点击child, 输出: container，child

container.addEventListener('click', () => console.log('container'))
child.addEventListener('click', () => console.log('child'))
// 点击child, 输出: child，container
```

假若还是在两个div中，希望点击子元素时不触发父元素的点击事件，我们就需要用到**阻止冒泡**的方式：`stopPropagation`，改写child的方法：

```
child.addEventListener('click', e => {
  console.log('child')
  e.stopPropagation()
});
```

说起了stopPropagation，还有一种方式为preventDefault，它的作用不是用于阻止冒泡，而是**阻止浏览器默认行为**，如a标签跳转，submit提交等。

还有一种方式称为**事件委托**，利用冒泡的机制，子元素的点击事件可由父元素委托执行，举个例子，还是如上视图，子元素点击事件删除以后，对父元素做以下定义：

```
container.addEventListener("click", e => {
  if (e.target.id === 'child') {
    console.log('child')
  }
});
```

可见，当点击子元素依然会输出`child`，在某些特定场景利用事件委托可节省大量的性能。



明白了上述事件关系，target与currentTarget也就易于理解了，简言之，**target指引发出发事件的元素，currentTarget则指事件绑定的元素**，如通过点击子元素出发父元素，那么父元素中event对象的target为子元素，而currentTarget为它本身。



## 示例

在这里有必要谈谈鼠标事件，大家可能知道但不记得的常用鼠标事件有以下四种：

- mouseenter：鼠标进入时触发，不响应子元素冒泡事件
- mouseover：鼠标进入时触发，响应子元素冒泡事件
- mouseleave：鼠标离开时触发，不响应子元素冒泡事件
- mouseout：鼠标离开时触发，响应子元素冒泡事件

让我们举一个实际场景来说明关于冒泡的应该(偷懒不附上详细代码了)：

![](http://7xp5r4.com1.z0.glb.clouddn.com/17-10-19/36934899.jpg)

场景如下：

- 鼠标移入每一行，显示编辑按钮，移出则取消
- 点击编辑按钮后，显示输入框，直到点击确定才回到之前的状态

其实这个场景看起来简单，不明白事件机制就容易遇到很多坑，毕竟是用原生js写，而不是jquery的解决方案，接下来我来说一下我实现此场景的步骤。

单看页面，其实就是ul>li结构，此场景的条数可能有上千条，我最先考虑到的也是hover机制，但是css hover并不能解决问题，因为点击编辑以后，就不受hover态影响了，因此该编辑与输入框的显示应该由两个元素变量来判断：`  <div class="schedule-input-wrap" v-show="isEdit || hovering">`，也就是说，hover过后hovering为true，点击编辑以后isEdit为true，点击确定以后并移开鼠标此元素才会隐藏。

有了思路，首先考虑**事件捕获机制**，也就是说，我只需要在ul上监听一个mouseover事件，然后通过target.id来判断鼠标移入的是哪个li就行了，但实际情况会比这个复杂，因为子元素也会触发mouseover事件，它会产生冒泡，这样一来，就不能单纯的实现li的hover效果，那怎么办呢？css中有个效果为`pointer-events:none;`，当我给子元素设置好此属性，结果真的就不冒泡了，能正常显示了，但是这样一来，子元素不仅不会响应mouseover事件，连click事件也不会显示了，因此果断排除掉。

后来的解决方法是在li上添加mouseenter事件，而在ul元素上加mouseleave事件，这样一来，hover态的变量控制就十分完美了，部分代码如下：

```
                <ul @mouseleave="hoverId=''">
                    <li v-for="(item, itemIndex) in record.schedulings"
                        @mouseenter="hoverId=`item${itemIndex}`"
                        ....
                        <schedule-input :hovering="isHovering(itemIndex)"
                        ></schedule-input>
                    </li>
                </ul>
```

其中，hovering的prop用于判定hoverId是否等于当前li的itemIndex。
