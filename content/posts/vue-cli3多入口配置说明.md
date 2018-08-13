---
title: "Vue Cli3多入口配置说明"
date: 2018-08-13T14:22:13+08:00
---

用Webpack对网站应用进行单页应用（SPA）构建无疑是一个比较好的选择，它具备用户体验好、维护方便等各种现代化特性，可是网页应用错综复杂，很多时候单页应用并不能解决所有问题，如在重SEO、兼容性要求高、基于桌面浏览器的传统网站中，若贸然全站使用SPA会带来后期高昂的维护成本，因此很少有应用全站使用SPA技术，因此单页应用也无法避免需要多入口打包的情况。

由于Webpack配置错综复杂，整个流程自由度也非常高，所以维护别人写配置会变得十分困难，因此在开发过程中往往会去选择Zero-Config的方式，也就是说由底层脚手架封装好基本配置信息，满足基本的使用要求，底层也做好了各打包环境的优化工作，常规配置信息在统一的配置文件进行改变，这样一来十分便于维护，二是开发者无需了解底层原理，开箱即用，某些脚手架也支持将配置进行导出后自行手动定制(create-react-app)。本文主要讲的是基于vue-cli3的多入口打包实践方法，也会介绍一些Webpack多入口的基本配置方法。

## vue-cli3多入口配置实例

用户通过自定义vue.config.js配置文件中的pages字段，即可开启框架的多入口模式，以下为配置字段的示例：

```
module.exports = {
  pages: {
    index: {
      // entry for the page
      entry: 'src/index/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  }，
  another: {...}
}
```

@vue/cli-service会根据我们是否传入pages字段来生成不同的webpack配置的相关插件，在项目工程中，我们通过一个函数来根据特定的文件夹目录结构自动生成这些配置信息，假设目录结构为：

```
/src
- pages
- - entry1
- - - app.vue
- - - main.js
- - - index.html
- - entry2
- - - app.vue
- - - main.js
- - - index.html
```

对应自动生成pages字段的vue.config.js文件为：

```
const path = require("path");
const glob = require("glob");
const fs = require("fs");

const config = {
  entry: "main.js",
  html: "index.html",
  pattern: ["src/pages/*"]
};

const genPages = () => {
  const pages = {};
  const pageEntries = config.pattern.map(e => {
    const matches = glob.sync(path.resolve(__dirname, e));
    return matches.filter(match => fs.existsSync(`${match}/${config.entry}`));
  });
  Array.prototype.concat.apply([], pageEntries).forEach(dir => {
    const filename = dir.split(path.sep).pop()
    pages[filename] = {
      entry: `${dir}/${config.entry}`,
      template: `${dir}/${config.html}`,
      filename: `${filename}/${config.html}`
    };
  });
  return pages;
};

module.exports = {
  pages: genPages()
};

```

需要注意的是，config.pattern定义了所包含多入口的路径，之所以使用这种形式，是为了更方便的定义基于不同根路径的多入口工程，我们也可以直接指定对应的文件夹，有选择性的去生成入口配置。
