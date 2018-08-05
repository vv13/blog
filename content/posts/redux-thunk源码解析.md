---
title: "Redux-Thunk源码解析"
date: 2018-07-22T12:05:23+08:00
---

redux-thunk是一个神奇的库，短短14行代码，目前将近1w个star，那么这个库究竟做了些什么事情呢？

## 什么是redux-thunk
在redux中，通常action由一个纯函数定义，返回一个对象形式的载体，再通过dispatch发送到reducer进行state的更新。而redux-thunk提供了一种异步派发action的能力，若action传递的值不是对象而是函数，则会将dispatch等作为参数传入函数中，以此在函数内部进行异步的触发流程。

## 源码解析

```
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```



首先，redux-thunk是一个redux的Middleware(中间件)，它的标准语法为：

```
const middlerware = store => dispatch => action => {
  return dispatch(action)
}
```

因此关于函数部分的定义也不难理解，需要解释一下的是`thunk.withExtraArgument`，它是在v2.1引入的，提供了一种自定义额外参数的能力，通过它可以传递一个特殊的参数供所有thunk函数使用：

```
const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument(api))
)

// later
function fetchUser(id) {
  return (dispatch, getState, api) => {
    // you can use api here
  }
}
```

语法解释清楚了，那我们现在来看看什么是中间件，官网有一句话解释：**It provides a third-party extension point between dispatching an action, and the moment it reaches the reducer**，也就是说，我们可以使用Redux中间件对整个触发请求的流程做扩展，比如通过定义一个Logger中间件，或者是包装dispatch方法，而redux-thunk的身份就是作为一个`Async Action Creators`。

redux-thunk的执行流程如下：

1. 判断dispatch的值是否为对象，若为对象，走正常的触发流程
2. 判断dispatch的值是否为函数，若为函数，则将其视为异步action触发器，并将dispatch方法与getState方法作为参数注入，如果全局注册了withExtraArgument的话也会作为第三个参数进行传入
