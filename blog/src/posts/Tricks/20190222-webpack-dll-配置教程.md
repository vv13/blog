---
title: "Webpack DLL 配置教程"
date: "2019-02-22"
tags: ["tricks"]
---

## 原理
DLL文件又称为动态链接库文件，它通常作为应用程序可执行代码的一部分，供应用程序在运行时进行调用。

在Webpack中，内置的DllPlugin与DllReferencePlugin插件可以通过使用DLL来大幅提高构建性能，以下为在普通工程中DLL机制说明图：
![Webpack DLL (1).png](/attachments/webpack_dll.png)

## 初始化项目
为了便于实验，我们通过使用`create-react-app`创建项目并eject出webpack配置：
```sh
npx create-react-app react-dll-demo
cd react-dll-demo && npm run eject
```

由于默认配置隐藏了编译信息，打开`webpackDevServer.config.js`，将`quiet: true`改为false，再启动一下项目，找出我们需要的信息：
```
Version: webpack 4.28.3
Time: 6985ms
Built at: 2019-02-21 10:46:42
                         Asset       Size        Chunks             Chunk Names
           asset-manifest.json  232 bytes                [emitted]
                    index.html   1.65 KiB                [emitted]
          static/js/0.chunk.js   4.21 MiB             0  [emitted]
           static/js/bundle.js   30.9 KiB  runtime~main  [emitted]  runtime~main
       static/js/main.chunk.js   47.4 KiB          main  [emitted]  main
static/media/logo.5d5d9eef.svg   2.61 KiB                [emitted]
```

## DLLPlugin

首先在package.json的scripts字段添加一条脚本：
```
{
  "build:dll": "webpack --config config/webpack.dll.config.js --mode production"
}
```

然后创建配置文件：
```js
// config/webpack.dll.config.js

const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    filename: '[name].dll.js',
    path: path.join(__dirname, '../public/dll'),
    libraryTarget: 'var',
    library: '_dll_[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../public/dll', '[name].manifest.json'),
      name: '_dll_[name]_[hash]'
    })
  ]
};
```

执行`npm run build:dll`，CLI应该会自动提示你安装`webpack-cli`，运行完成后可以看到以下文件：
```
public/dll
├── react.dll.js
└── react.manifest.json
```

## DLLReferencePlugin
打开`config/webpack.config.js`，在根对象plugins字段中写入该插件：
```js
{
  plugins: [
    // ...
    new webpack.DllReferencePlugin({
        manifest: require(path.join(
        __dirname,
        '../public/dll/react.manifest.json'
        ))
    }),
  ]
}
```

最后一个步骤，在index.html我们先手动引入dll依赖：
```html
    ...
    <div id="root"></div>
    <script src="/dll/react.dll.js"></script>
    ...
```

此时重新运行程序，等待项目正常运行，再检查一下编译信息：
```
Version: webpack 4.28.3
Time: 4883ms
Built at: 2019-02-21 11:19:11
                         Asset       Size        Chunks             Chunk Names
           asset-manifest.json  232 bytes                [emitted]
                    index.html   1.69 KiB                [emitted]
          static/js/0.chunk.js   1.82 MiB             0  [emitted]
           static/js/bundle.js   30.9 KiB  runtime~main  [emitted]  runtime~main
       static/js/main.chunk.js   52.1 KiB          main  [emitted]  main
static/media/logo.5d5d9eef.svg   2.61 KiB                [emitted]
```

很显然的看到，在development模式下，构建时间降低了2s，打包大小降低了2.4M，相信将DLL运用到项目工程中，你能收获到更多的惊喜。

## 优化
以上程序只是为了快速入手与demo搭建，需要优化的地方还有很多，在此简单的列举几点，供大家参考。
#### 自动注入编译文件到HTML
通过安装`html-webpack-include-assets-plugin`插件，可以自动将相应文件注入到index.html中，就可以避免手动进行更改了：
```js
// config/webpack.config.js
const HtmlIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
// ...
{
  plugins: [
    new HtmlIncludeAssetsPlugin({
      assets: ['dll/react.dll.js'],
      append: false // 在其他资源前添加
    }),
  ]
}
```

#### DLL的缓存问题与自动加载
我们通常不会对html文件做缓存，每次发版本时采用增量发布，只要html的依赖文件名变了，则会重新去解析静态资源列表。除此之外，还需要提供一个函数，自动去加载文件夹内的多入口dll文件，以下为核心代码：

config/dllHelper.js：
```
// config/dllHelper.js
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const dllConfig = require('./webpack.dll.config');

// 根据entry生成DllReferencePlugin列表
function genDllReferences() {
  return Object.keys(dllConfig.entry).map(
    name =>
      new webpack.DllReferencePlugin({
        manifest: require(path.join(
          __dirname,
          '../public/dll',
          `${name}.manifest.json`
        ))
      })
  );
}

// 生成dll文件的静态资源路径
function loadDllAssets() {
  return fs
    .readdirSync(path.resolve(__dirname, '../public/dll'))
    .filter(filename => filename.match(/.dll.js$/))
    .map(filename => `dll/${filename}`);
}

module.exports = {
  loadDllAssets,
  genDllReferences
};
```

config/webpack.dll.config.js：
```
// 
{
  ...
  output: {
    filename: '[name].[hash:8].dll.js'
  }
}
```

config/webpack.config.js：
```
const dllHelper = require('./dllHelper');
...
{
  plugins: [
    ...dllHelper.genDllReferences(),
    new HtmlIncludeAssetsPlugin({
      assets: dllHelper.loadDllAssets(), 
      append: false
    })
  ]
}
```

#### 构建前清空文件夹
若DLLPlugiun的entry发生变化，则dll内的文件可能会越来越多，因此我们需要在构建dll前清空文件夹，在这里推荐这两个package：
- npm-run-all，在scripts可串行或并行执行script
- rimraf，nodejs删除文件利器

首先安装相应依赖：`yarn add -D rimraf npm-run-all`，然后修改package.json：
```js
scripts: {
  "make:dll": "npm-run-all clear:dll build:dll",
  "build:dll": "webpack --config config/webpack.dll.config.js --mode production",
  "clear:dll": "rimraf public/dll",
}
```

之后在变动DLL时，一定要记得执行：`npm run make:dll`。

## 其他
Demo仓库地址：[GitHub - vv13/react-dll-demo](https://github.com/vv13/react-dll-demo.git)
