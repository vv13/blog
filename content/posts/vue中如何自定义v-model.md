---
layout: "post"
title: "vue中如何自定义v-model"
date: 2017-03-31
tags: ['vue']
---

## 简介
在vue的表单中，大家都享受着v-model带来的便利性，有时候也会遇到自定义v-model的场景，其实它是一颗语法糖而已，那我们接下来就来吃糖吧。

基本的v-model用法为：
```
<input v-model="something">
```

其实它是以下用法的简写：
```
<input :value="something" @input="something = $event.target.value" />
```

因此，自己封装组件的话，可以这样来定义：


```
// demo.vue
<template lang="html">
  <input :value="value" @input="valueChange">
</template>

<script>
export default {
  props: ['value'],
  methods: {
    valueChange (v) {
      this.$emit('input', v.target.value)
    }
  }
}
</script>

// 引用
<demo v-model="something"></demo>
```

## 用法示例
在使用element组件库中，有些组件需要借助拆分v-model自定义命令才能实现需要的功能，如下:

![](http://i4.buimg.com/567571/4be2a48163ab3278.png)

我们想要展示的数据格式为：

![](http://i2.muimg.com/567571/22498a7d7df1a596.png)

仔细查阅接口文档，并没有我们需要的格式化数据方法，只有一个format => YYMMDD的类似方法，但是看示例代码它实现了v-model的双向绑定：
```
<el-time-select
  v-model="value1"
</el-time-select>
```

因此，我们可以通过@input事件获取到它的改变值，然后再通过:value展示时添加一个过滤器，将字符串转换以下即可：

```
<el-time-select
  :value="time | convertToRangeTime"
  @input="e => time = e"
</el-time-select>
```
