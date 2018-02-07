---
layout: post
title: js代理函数技巧
date: 2016-12-09
tags: ['js']
---

#### 简述
有时候我们总想改造某些函数，保留它原有的功能与参数，追加新的操作在里面，若是自己写的函数，则直接改写函数即可，但假若是系统给定的函数与未知的参数，那么该怎么办呢？

#### 示例
假设下面有一个自定义函数splice, 它主要的功能是删除原数组指定索引元素，再将其返回：
```
function splice(arrs, start, length) {
  arrs.splice(start, length);
  return arrs;
}

const arrs = [1,2,3];
splice(arrs, 1, 1); // 返回为：[1,3]
```

如果我们需要扩展splice，比如打印被删除的元素信息，则只需要进行如下更改：

```
function splice(arrs, start, length) {
  console.log(`索引位置：${start}, 长度${length}，元素为：${arrs.splice(start, length)}`);
  return arrs;
}
const arrs = [1,2,3];
splice(arrs, 1, 2); // 返回为: [1]
// 索引位置：1, 长度2，元素为：2,3
```

上述方法并不太理想，因为这样一来每次扩展方法都会修改原方法，我们不希望原方法进行修改。splice是es5内置的数组方法，就算想要修改原方法也不行，那么应该怎么做呢？这时候就应该使用代理了:

```
const arrs = [1,2,3];
const proxy = (...args) => {
  const cutArrs = arrs.splice.apply(arrs, args);
  console.log(`索引位置：${args[0]}, 长度${args[1]}，元素为：${cutArrs}`);
}
proxy(1, 2); // 索引位置：1, 长度2，元素为：2,3
console.log(arrs); // [1]
```

#### 代理做了什么
通过proxy(...)调用，可以保持原有函数的传参模式，在不修改函数的情况，对函数进行了功能扩展，意义在于我们给原有的函数加了一些功能，可使用传入的参数进行进一步操作，而不是修改函数体本身。

原理如下
1. 将参数通过...args传入，它会变为一个args数组
2. 通过apply进行调用原函数，需注意的是，splice属于数组的作用域而不是当前的执行环境，因此apply的第一个参数不应该填this，直接填数组本身
3. 在proxy方法体中进行进一步操作，构造完毕
4. 按原顺序传入参数，进行执行。

#### 实际用例
在react项目中，我需要使用到redux-form传入的reset的操作，以此来清除表单，但是清除后我还需要改变state将表单收起，这样一个需求建立在一个这样的代码中：
```
// reset方法通过reduxForm包装来注入：
export default reduxForm({
  form: 'xxx',
})(xxx);

// 清除按钮
<button
  type="button"
  className={style['invoice-btn']}
  onClick={this.props.reset}
>
```

我们并不清除reset参数具体的传入顺序与值，仅仅是想追加一个操作，这在react中十分常见，因为很多方法都是从父组件传递进来的，我们一般直接绑定到指定子组件中即可，如果我们想追加操作，可以这样：
```
<button
  type="button"
  className={style['xxx']}
  onClick={(...args) => {
    reset.apply(this, args);
    this.props.hideit();
  }}
>

```

#### 结尾
谢谢阅读。
