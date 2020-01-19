---
layout: post
title: 'TypeScript 模块解析笔记'
date: '2019-12-29'
tags: ['笔记']
---

在进行 TypeScript 项目开发时，我们会使用`import`导入 npm 或是自定义 module，编译器会进行路径解析并弄清楚导入的模块是什么内容。在编译器进行解析文件路径时，会存在两种模式：相对路径导入与非相对路径导入。

相对路径通常由`./`、`../`开头，比如`import a from '../a`，它们通常表示的为相对于当前文件的路径位置，或者使用`/`表示相对于根文件夹所处文件的位置，一旦申明，便不可通过外部环境变量更改，并且需要在运行环境中也保持相同的文件路径依赖关系。

而非相对路径的导入，如 `import _ from '_'`，它们会根据配置文件中的`baseUrl`进行相对路径的解析，或者通过`paths`进行路径映射解析，此外它们还可以被解析为外部模块申明。

除了路径的引用方式的不同以外，编译器还有它都有的解析策略：**Classic** 或者 **Node**，解析策略告诉编译器如何去搜寻相应模块。

假设在一个路径为 `/root/src/A.ts` 的文件内，存在以下引用：
```
import B from './B';
import C from 'C';
```
我们来看看不同的策略会有什么处理方式。

#### Classic

Classic 如今作为一种向后兼容的方案，只有在`--module AMD | System | ES2015`的时候才使用该策略。

对于模块 B 来讲，编辑器查找顺序如下：
1. /root/src/B.ts
2. /root/src/B.d.ts

而对于模块 C，编译器会从包含导入文件的目录开始依次向上级目录遍历，尝试定位匹配的声明文件：
1. /root/src/C.ts
2. /root/src/C.d.ts
3. /root/C.ts
4. /root/C.d.ts
5. /C.ts
6. /C.d.ts

#### Node
TypeScript 是模仿 Node.js 运行时的解析策略来在编译阶段定位模块定义文件，而通常在 Node.js 中是通过 require 来定义解析函数，因此先来看看 Node.js 版本：
```
// /root/src/A.js
const B = require('./B');
const C = require('C');
```
对于模块 B，查找步骤为：
1. /root/src/B.js
2. 查找 /root/src/B 目录是否存在 package.json，且 package.json 中存在 main 字段的定义，假如 main 字段定义为：`lib/mainModules.js`，则解析路径为：`/root/src/B/lib/mainModules.js`
3. 查找 /root/src/B 目录是否存在index.js，如果存在，解析路径为：`/root/src/B/index.js`

但是，非相对模块名的解析是个完全不同的过程，对于 模块 C，Node 会向上级目录遍历，查找每个 node_modules 直到它找到要加载的模块：
1. /root/src/node_modules/B.js
2. /root/src/node_modules/B/package.json(如果存在 main 属性)
3. /root/src/node_modules/B/index.js
4. /root/node_modules/B.js
5. /root/node_modules/B/package.json(如果存在 main 属性)
6. /root/node_modules/B/index.js
7. /node_modules/B.js
8. /node_modules/B/package.json(如果存在 main 属性)
9. /node_modules/B/index.js

而 TypeScript 在 Node 解析逻辑基础上增加了 TypeScript 源文件的扩展名（ .ts，.tsx和.d.ts），同时，TypeScript 在 package.json 里使用字段 `types` 来表示类似 main 的意义。对于解析模块 B，TypeScript 的查找路径为：
1. /root/src/B.ts
2. /root/src/B.tsx
3. /root/src/B.d.ts
4. /root/src/B/package.json (如果指定了"types"属性)
5. /root/src/B/index.ts
6. /root/src/B/index.tsx
7. /root/src/B/index.d.ts

同理可得非相对路径模块解析策略。

## 在工程中使用非相对路径
假设一个工程结构为：
```
└── src
    └── components
        └── C.ts
    └── pages
        └── A
            └── B.ts
```
若在 B.ts 中使用相对路径引入代码为：`import B from '../../components/C'`，针对于这一类型的代码，我们可以修改 tsconfig.json：
```
{
  "compilerOptions": {
    "baseUrl": "./src",
  }
}
```

此时，通过`import C from 'components/C.ts` 即可。此时的 C 模块解析策略为：
1. 执行 Node 的相对路径解析策略：`baseUrl/components/C.ts`
2. 若相对路径解析不了，再进行 Node 非相对路径解析策略

需要注意的是，如果是 webpack 工程，请同时配置 `resolve.modules`字段，它默认只会解析 `node_modules`，为了适配`baseUrl`值，需要进行以下更改：
```
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  }
```

作为一个大型工程来讲，项目内可能有很多三方依赖，如果直接设置 baseUrl，那么我们可能很难去区分哪些引入是 npm 包，哪些引入是相对引入，因此我们会出现路径映射的需求，比如通过自定义前缀进行导入模块（前缀可为`src`、`@`、`~`等特殊符合）：
```
import C from '@/components/C.ts';
```

为了实现此映射，配置 tsconfig.json 中的 paths即可，需要注意的是，当 paths 存在时，也必须设置 baseUrl：
```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

对于 webpack 工程，还需要设置 `resolve.alias` 字段：
```
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src")
    }
  }
```

## 参考文章
- [module-resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
