---
title: '理解Flux与Redux架构'
date: '2019-03-23'
tags: ['前端']
---

Redux是一个通用的前端状态管理库，它不仅广泛应用于 React App，在 Wepy、Flutter 等框架中也随处可见它的身影，可谓是一招鲜吃遍天，它同时深受喜欢函数式编程(Functional Programming)人们的追捧，今天我就来和大家聊一聊Redux的基本思想。

## Flux
Flux是Facebook用于构建客户端Web应用程序的基本架构，我们可以将Flux看做一种应用程序中的数据流的设计模式，而Redux正是基于Flux的核心思想实现的一套解决方案，它也得到了原作者的肯定。

首先，在Flux中会有以下几个角色的出现：

- Dispacher：调度器，接收到Action，并将它们发送给Store。
- Action：动作消息，包含动作类型与动作描述。
- Store：数据中心，持有应用程序的数据，并会响应Action消息。
- View：应用视图，可展示Store数据，并实时响应Store的更新。

从通讯的角度还可将其视为`Action请求层 -> Dispatcher传输层 -> Store处理层 -> View视图层`。

#### 单向数据流

Flux应用中的数据以单一方向流动：

1. 视图产生动作消息，将动作传递给调度器。
2. 调度器将动作消息发送给每一个数据中心。
3. 数据中心再将数据传递给视图。

![](http://qn.vv13.cn/flux-simple-f8-diagram-with-client-action-1300w.png)

单一方向数据流还具有以下特点：

- 集中化管理数据。常规应用可能会在视图层的任何地方或回调进行数据状态的修改与存储，而在Flux架构中，所有数据都只放在Store中进行储存与管理。
- 可预测性。在双向绑定或响应式编程中，当一个对象改变时，可能会导致另一个对象发生改变，这样会触发多次级联更新。对于Flux架构来讲，一次Action触发，只能引起一次数据流循环，这使得数据更加可预测。
- 方便追踪变化。所有引起数据变化的原因都可由Action进行描述，而Action只是一个纯对象，因此十分易于序列化或查看。

#### Flux的工作流

从上面的章节中我们大概知道了Flux中各个角色的职责，那现在我们再结合着简单的代码示例讲解一下他们是如何构成一整个工作流的：
![b6682c2d.png](http://qn.vv13.cn/b6682c2d.png)

上图中有一个`Action Creator`的概念，其实他们就是用于辅助创建Action对象，并传递给Dispatcher：

```
function addTodo(desc) {
  const action = {
    type: 'ADD_TODO',
    payload: {
      id: Date.now(),
      done: false,
      desciption: desc
    }
  }
  dispatcher(action)
}
```

在这里我还是希望通过代码的形式进行简单的描述，会更直观一点，首先初始化一个项目：

```sh
mkdir flux-demo && cd flux-demo
npm init -y && npm i react flux
touch index.js
```

然后，我们创建一个Dispatcher对象，它的本质是Flux系统中的事件系统，用于触发事件与响应回调，而且在Flux中仅会有一个全局的Dispatcher对象：

```
import { Dispatcher } from 'flux';

const TodoDispatcher = new Dispatcher();
```

接着，注册一个Store，响应Action方法：

```
import { ReduceStore } from 'flux/utils';

class TodoStore extends ReduceStore {
  constructor() {
    super(TodoDispatcher);
  }

  getInitialState() {
    return [];
  }

  reduce(state, action) {
    switch (action.type) {
      case 'ADD_TODO':
        return state.concat(action.payload);

      default:
        return state;
    }
  }
}
const TodoStore = new TodoStore();
```

在Store的构造器中将`TodoDispatcher`传递给了父级构造器调用，其实是在Dispatcher上调用`register`方法注册了Store，将其作为`dispatch`的回调方法，用于响应每一个Action对象。

到了这里几乎已经完成了一个Flux示例，就剩下连接视图了。当 Store 改变时，会触发一个 Change 事件，通知视图层进行更新操作，以下为完整代码：

```js
const { Dispatcher } = require('flux');
const { ReduceStore } = require('flux/utils');

// Dispatcher
const TodoDispatcher = new Dispatcher();

// Action Types
const ADD_TODO = 'ADD_TODO';

// Action Creator
function addTodo(desc) {
  const action = {
    type: 'ADD_TODO',
    payload: {
      id: Date.now(),
      done: false,
      desciption: desc
    }
  };
  TodoDispatcher.dispatch(action);
}

// Store
class TodoStore extends ReduceStore {
  constructor() {
    super(TodoDispatcher);
  }

  getInitialState() {
    return [];
  }

  reduce(state, action) {
    switch (action.type) {
      case ADD_TODO:
        return state.concat(action.payload);

      default:
        return state;
    }
  }
}
const todoStore = new TodoStore();

console.log(todoStore.getState()); // []
addTodo('早晨起来，拥抱太阳');
console.log(todoStore.getState()); // [ { id: 1553392929453, done: false, desciption: '早晨起来，拥抱太阳' } ]
```

#### Flux与React

Flux 这样的架构设计其实在很早之前就出现了，但是为什么近几年才盛行呢？我认为很大一部分因素取决于 React 框架的出现，正是因为 React 的 Virtual DOM 让数据驱动成为了主流，再加上高效率的`React diff`，使得这样的架构存在更加合理：
![a837658f.png](http://qn.vv13.cn/a837658f.png)


在靠近视图的顶层结构中，有一个特殊的视图层，在这里我们称为视图控制器( View Controller )，它用于从Store中获取数据并将数据传递给视图层及其后代，并负责监听Store中的数据改变事件。

当接受到事件时，首先视图控制器会从Store获取最新的数据，并调用自身的`setState`或`forceUpdate`函数，这些函数会触发View的render与所有后代的re-render方法。

通常我们会将整个Store对象传递到View链的顶层，再由View的父节点依次传递给后代所需要的Store数据，这样能保证后代的组件更加的函数化，减少了Controller-View的个数也意味着使更好的性能。

## Redux
Redux是JavaScript应用可预测的状态管理容器，它具有以下特性：
- 可预测性，使用Redux能帮助你编写在不同的环境中编写行为一致、便于测试的程序。
- 集中性，集中化应用程序的状态管理可以很方便的实现撤销、恢复、状态持久化等。
- 可调式，Redux Devtools提供了强大的状态追踪功能，能很方便的做一个时间旅行者。
- 灵活，Redux适用于任何UI层，并有一个庞大的生态系统。

它还有三大原则：
- 单一数据源。整个应用的State储存在单个Store的对象树中。
- State状态是只读的。您不应该直接修改State，而是通过触发Action来修改它。Action是一个普通对象，因此它可以被打印、序列化与储存。
- 使用纯函数进行修改状态。为了指定State如何通过Action操作进行转换，需要编写reducers纯函数来进行处理。reducers通过当前的状态树与动作进行计算，每次都会返回一个新的状态对象。

#### 与Flux的不同之处

![123](http://qn.vv13.cn/1_3lvNEQE4SF6Z1l-680cfSQ.jpeg)

Redux受到了Flux架构的启发，但在实现上有一些不同：

- Redux并没有 dispatcher。它依赖纯函数来替代事件处理器，也不需要额外的实体来管理它们。Flux尝尝被表述为：`(state, action) => state`，而纯函数也是实现了这一思想。
- Redux为不可变数据集。在每次Action请求触发以后，Redux都会生成一个新的对象来更新State，而不是在当前状态上进行更改。
- Redux有且只有一个Store对象。它的Store储存了整个应用程序的State。

#### Action
在Redux中，Action 是一个纯粹的 JavaScript 对象，用于描述Store 的数据变更信息，它们也是 Store 的信息来源，简单来说，所有数据变化都来源于 Actions 。

在 Action 对象中，必须有一个字段`type`用于描述操作类型，他们的值为字符串类型，通常我会将所有 Action 的 type 类型存放于同一个文件中，便于维护（小项目可以不必这样做）：
```
// store/mutation-types.js
export const ADD_TODO = 'ADD_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'

// store/actions.js
import * as types from './mutation-types.js'

export function addItem(item) {
  return {
    type: types.ADD_TODO,
    // .. pass item
  }
}
```

Action对象除了type以外，理论上其他的数据结构都可由自己自定义，在这里推荐[flux-standard-action](https://github.com/redux-utilities/flux-standard-action)这个Flux Action标准，简单来说它规范了基本的Action对象结构信息：
```
{
  type: 'ADD_TODO',
  payload: {
    text: 'Do something.'
  }
}
```

还有用于表示错误的Action：
```
{
  type: 'ADD_TODO',
  payload: new Error(),
  error: true
}
```

在构造 Action 时，我们需要使 Action 对象尽可能携带更少的数据信息，比如可以通过传递 id 的方式取代整个对象。

#### Action Creator
我们将Action Creator与Action进行区分，避免混为一谈。在Redux中，Action Creator是用于创建动作的函数，它会返回一个Action对象：
```
function addTodo(text) {
  return {
    type: 'ADD_TODO',
    payload: {
      text,
    }
  }
}
```

与`Flux`所不同的是，在Flux 中Action Creator 同时会负责触发 dispatch 操作，而Redux只负责创建Action，实际的派发操作由`store.dispatch`方法执行：`store.dispatch(addTodo('something'))`，这使得Action Creator的行为更简单也便于测试。

###### bindActionCreators
通常我们不会直接使用`store.dispatch`方法派发 Action，而是使用connect方法获取`dispatch`派发器，并使用`bindActionCreators`将Action Creators自动绑定到dispatch函数中：
```
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { addTodo },
    dispatch
  );
}

const Todo = ({ addTodo }) => {}
export default connect(null, mapDispatchToProps)(Todo);
```

通过`bindActionCreators`之后，我们可以将这些Action Creators传递给子组件，子组件不需要去获取`dispatch`方法，而是直接调用该方法即可触发Action。

#### Reducers
对于Action来讲，它们只是描述了发生了什么事情，而应用程序状态的变化，全由Reducers进行操作更改。

在实现Reducer函数之前，首先需要定义应用程序中State的数据结构，它被储存为一个单独的对象中，因此在设计它的时候，尽量从全局思维去考虑，并将其从逻辑上划分为不同的模块，采用最小化、避免嵌套，并将数据与UI状态分别存储。

Reducer是一个纯函数，它会结合先前的state状态与Action对象来生成的新的应用程序状态树：
```
(previousState, action) => newState
```

内部一般通过`switch...case`语句来处理不同的Action。

保持Reducer的纯函数特性非常重要，Reducer需要做到以下几点：
- 不应该直接改变原有的State，而是在原有的State基础上生成一个新的State。
- 调用时不应该产生任何副作用，如API调用、路由跳转等。
- 当传递相同的参数时，每次调用的返回结果应该是一致的，所以也要避免使用`Date.now()`或`Math.random()`这样的非纯函数。

###### combineReducers

Redux应用程序最常见的State形状是一个普通的Javascript对象，其中包含每个顶级键的特定于域的数据的“切片”，每个“切片”都具有一个相同结构的reducer函数处理该域的数据更新，多个reducer也可同时响应同一个action，在需要的情况独立更新他们的state。

正是因为这种模式很常见，Redux就提供了一个工具方法去实现这样的行为：`combineReducers`。它只是用于简化编写Redux reducers最常见的示例，并规避一些常见的问题。它还有一个特性，当一个Action产生时，它会执行每一个切片的reducer，为切片提供更新状态的机会。而传统的单一Reducer无法做到这一点，因此在根Reducer下只可能执行一次该函数。

Reducer函数会作为`createStore`的第一个参数，并且在第一次调用reducer时，`state`参数为`undefined`，因此我们也需要有初始化State的方法。举一个示例：
```
const initialState = { count: 0 }

functino reducer(state = initialState, action) {
  switch (action.type) {
    case: 'INCREMENT':
      return { count: state.count + 1 }
    case: 'DECREMENT':
      return { count: state.count - 1 }
    default:
      return state;
  }
}
```

对于常规应用来讲，State中会储存各种各样的状态，从而会造成单一Reducer函数很快变得难以维护：
```
  ...
  case: 'LOADING':
    ...
  case: 'UI_DISPLAY':
    ...
  ...
```

因此我们的核心目标是将函数拆分得尽可能短并满足单一职责原则，这样不仅易于维护，还方便进行扩展，接下来我们来看一个简单的TODO示例：
```
const initialState = {
  visibilityFilter: 'SHOW_ALL',
  todos: []
}

function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER': {
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    }
    case 'ADD_TODO': {
      return Object.assign({}, state, {
        todos: state.todos.concat({
          id: action.id,
          text: action.text,
          completed: false
        })
      })
    }
    default:
      return state
  }
}
```

这个函数内包含了两个独立的逻辑：过滤字段的设置与TODO对象操作逻辑，如果继续扩展下去会使得Reducer函数越来越庞大，因此我们需要将这两个逻辑拆分开进行单独维护：
```
function appReducer(state = initialState, action) {
  return {
    todos: todosReducer(state.todos, action),
    visibilityFilter: visibilityReducer(state.visibilityFilter, action)
  }
}

function todosReducer(todosState = [], action) {
  switch (action.type) {
    case 'ADD_TODO': {
      return Object.assign({}, state, {
        todos: state.todos.concat({
          id: action.id,
          text: action.text,
          completed: false
        })
      })
    }
    default:
      return todosState
  }
}

function visibilityReducer(visibilityState = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return setVisibilityFilter(visibilityState, action)
    default:
      return visibilityState
  }
}
```

我们将整个Reducer对象拆为两部分，并且他们独自维护自己部分的状态，这样的设计模式使得整个Reducer分散为独立的切片。Redux内置了一个`combineReducers`工具函数，鼓励我们这样去切分顶层Reducer，它会将所有切片组织成为一个新的Reducer函数：
```
const rootReducer = combineReducers({
  todos: todosReducer,
  visibilityFilter: visibilityReducer
})
```

在 combineReducers 返回的state对象中，每个键名都代表着传入时子Reducer的键名，他们作为子Reducer中 State 的命名空间。


#### Store
在Redux应用中只有一个单一的store，通过`createStore`进行创建。Store对象用于将Actions与Reducers结合在一起，它具有有以下职责：
- 储存应用的State，并允许通过`getState()`方法访问State。
- 提供`dispatch(action)`方法将Action派发到Reducer函数，以此来更新State。
- 通过`subscribe(listener)`监听状态更改。

对于`subscribe`来讲，每次调用`dispatch`方法后都会被触发，此时状态树的某一部分可能发生了改变，我们可以在订阅方法的回调函数里使用`getState`或`dispatch`方法，但需要谨慎使用。`subscribe`在调用后还会返回一个函数`unsubscribe`函数用于取消订阅。

#### Middleware
对于中间件的概念相信大家通过其他应用有一定的概念了解，对于Redux来讲，当我们在谈论中间件时，往往指的是从一个Action发起直到它到达Reducer之前的这一段时间里所做的事情，Redux通过Middleware机制提供给三方程序扩展的能力。

为了更好的说明中间件，我先用Redux初始化一个最简实例：
```
const { createStore } = require('redux');

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

function reducer(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      throw new Error('decrement error'); 
    default:
      return state;
  }
}

void function main() {
  const store = createStore(reducer);
  store.dispatch({ type: INCREMENT });
  console.log(store.getState()); // 打印 1
}()

```

###### Step 1. 手动添加打印日志的中间件
为了深刻的理解Redux中间件，我们一步步去实现具有中间件功能的函数。为了追踪程序的状态变化，可能我们需要实现一个日志打印中间件机制，用于打印Action与执行后的State变化。我们首先通过`store`对象创建一个`logger`对象，在`dispatch`的前后进行日志打印：
```
void (function main() {
  const store = createStore(reducer);
  const logger = loggerMiddleware(store);
  logger({ type: INCREMENT });

  function loggerMiddleware(store) {
    return action => {
      console.log('dispatching', action);
      let result = store.dispatch(action);
      console.log('next state', store.getState());
      return result;
    };
  }
})();

// 程序运行结果
dispatching { type: 'INCREMENT' }
next state 1
```

###### Step 2. 再添加一个错误打印的中间件
为了监控应用程序的状态，我们还需要实现一个中间件，当在应用程序`dispatch`过程中发生错误时，中间件能及时捕获错误并上报（通常可上报至Sentry，但在这里就简单打印错误了）：
```
void (function main() {
  const store = createStore(reducer);
  const crasher = crashMiddleware(store);
  crasher({ type: DECREMENT });

  function crashMiddleware(store) {
    return action => {
      try {
        return dispatch(action);
      } catch (err) {
        console.error('Caught an exception!', err);
      }
    };
  }
})();
```

执行程序后，可在命令行内看到函数正确的捕获`DECREMENT中的错误`：
```
Caught an exception! ReferenceError: dispatch is not defined
```

###### Step 3. 将2个中间件串联在一起
在应用程序中一般都会有多个中间件，而将不同的中间件串联在一起是十分关键的一步操作，若你读过`Koa2`的源码，你大概了解一种被称之为`compose`的函数，它将负责处理中间件的级联工作。

在这里，为了理解其原理，我们还是一步一步进行分析。前面两个中间件的核心目标在于将Dispatch方法进行了一层包装，这样来说，我们只需要将dispatch一层层进行包裹，并传入最深层的中间件进行调用，即可满足我们程序的要求：
```
dispatch = store.dispatch

↓↓↓

// 没有中间件的情况
dispatch(action)

↓↓↓

// 当添加上LoggerMiddleware
LoggerDispatch = action => {
  // LoggerMiddleware TODO
  dispatch(action)
  // LoggerMiddleware TODO
}
dispatch(action)

↓↓↓

// 当添加上CrashMiddleware
CrashDispatch = action => {
  // CrashMiddleware TODO
  LoggerDispatch(action)
  // CrashMiddleware TODO
}

```

如果你熟悉使用高阶函数，相信上述思路并不难以理解，那让我们通过修改源代码，尝试一下通过这样的方式，是否能使两个中间件正常工作：
```
void function main() {
  const store = createStore(reducer);
  let dispatch = store.dispatch
  dispatch = loggerMiddleware(store)(dispatch)
  dispatch = crashMiddleware(store)(dispatch)
  dispatch({ type: INCREMENT });
  dispatch({ type: DECREMENT });

  function loggerMiddleware(store) {
    return dispatch => {
      return action => {
        console.log('dispatching', action);
        let result = dispatch(action);
        console.log('next state', store.getState());
        return result;
      };
    };
  }

  function crashMiddleware(store) {
    return dispatch => {
      return action => {
        try {
          return dispatch(action);
        } catch (err) {
          console.error('Caught an exception!', err);
        }
      };
    };
  }
}();
```

此时打印结果为（符合预期）：
```
dispatching { type: 'INCREMENT' }
next state 1
dispatching { type: 'DECREMENT' }
Caught an exception! Error: decrement error
```

当然，我们希望以更优雅的方式生成与调用dispatch，我会期望在创建时，通过传递一个中间件数组，以此来生成`Store`对象：
```
// 简单实现
function createStoreWithMiddleware(reducer, middlewares) {
  const store = createStore(reducer);
  let dispatch = store.dispatch;
  middlewares.forEach(middleware => {
    dispatch = middleware(store)(dispatch);
  });
  return Object.assign({}, store, { dispatch });
}


void function main() {
  const middlewares = [loggerMiddleware, crashMiddleware];
  const store = createStoreWithMiddleware(reducer, middlewares);
  store.dispatch({ type: INCREMENT });
  store.dispatch({ type: DECREMENT });
  // ...
}()
```

###### Step 4. back to Redux
通过Step 1 ~ 3 的探索，我们大概是照瓢画葫实现了Redux的中间件机制，现在让我们来看看Redux本身提供的中间件接口。

在`createStore`方法中，支持一个`enhancer`参数，意味着三方扩展，目前支持的扩展仅为通过`applyMiddleware`方法创建的中间件。

applyMiddleware支持传入多个符合`Redux middleware API`的Middleware，每个Middleware的形式为：`({ dispatch, getState }) => next => action`。让我们稍作修改，通过applyMiddleware与createStore接口实现（只需要修改创建store的步骤）：
```
  // ...
  const middlewares = [loggerMiddleware, crashMiddleware];
  const store = createStore(reducer, applyMiddleware(...middlewares));
  // ...
```

通过applyMiddleware方法，将多个 middleware 组合到一起使用，形成 middleware 链。其中，每个 middleware 都不需要关心链中它前后的 middleware 的任何信息。 Middleware最常见的场景是实现异步actions方法，如`redux-thunk`与`redux-saga`。

## redux-thunk

对于一个标准的Redux应用程序来说，我们只能简单的通过派发Action执行同步更新，而 redux-thunk 借由中间件机制，提供给了Redux异步派发Action的能力，可谓说 redux-thunk 与 redux 是天造地设的一对。

为了明白什么是 redux-thunk ，先回想一下上文介绍的Middleware API：`({ dispatch, getState }) => next => action`，借由灵活的中间件机制，它提供给 redux-thunk 延迟派发Action的能力，允许了人们在编写Action Creator时，可以不用马上返回一个Action对象，而是返回一个函数进行异步调度，于是称之为`Async Action Creator`：

```js
// synchronous, Action Creator
function increment() {
	return {
    type: 'INCREMENT'
	}
}

// asynchronous, Async Action Creator
function incrementAsync() {
  return dispatch => {
    setTimeout(() => dispatch({ type: 'INCREMENT' }), 1000)
  }
}
```

而 redux-thunk 源码也不过10行左右：

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

我们通过 dispatch 派发Action时，redux-thunk 中间件会判断action是否为函数，若为函数，则将dispatch传入action中由回调函数延时触发；若Action类型为纯对象，则直接进行派发。

为什么称其为"thunk"，它是来源于"think"，**i变为了u，意味着将绝对权从我转交给你**，这是我认为较好的解释。如果要溯源的话，其实这是一种“求值策略”的模式，即函数参数到底应该何时求值，比如一个函数：

```
function test(y) { return y + 1 }
const x = 1;
test(x + 1);
```

这时人们有两种争论点：

- 传值调用，即在进入函数体之前，就计算`x + 1 = 2`，再将值传入函数；
- 传名调用，即直接将表达式`x + 1`传入函数，需要用到时再计算表达式的值。

而通常编译器的“传名调用”的实现，往往是将参数放到一个临时函数中，再将临时函数传入函数体内，而这个函数就被称之为 Thunk ，若采取传名调用，上面的函数调用会转化为 Thunk 传参形式：

```
const thunk = () => (x + 1)
function test(thunk) {
  return thunk() + 1;
}
```

## 参考资料

- [Getting Started with Redux · Redux](https://redux.js.org/introduction/getting-started)

- [Flux \| Application Architecture for Building User Interfaces](https://facebook.github.io/flux/doc s/in-depth-overview.html#content)

- [GitHub - redux-utilities/flux-standard-action: A human-friendly standard for Flux action objects.](https://github.com/redux-utilities/flux-standard-action)
