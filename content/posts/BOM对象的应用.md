---
layout: post
title: BOM对象的应用
date: 2016-12-18
tags: ['js']
---

BOM即浏览器对象模型，在js代码里，存在一个代表窗体的全局window对象，通过它可以与浏览器进行一定的交互功能，如：
+ 跳转到新的网址：`window.location.href = 'http://www.google.com';`
+ 打开新的窗体：`window.open('http://www.google.com');`
+ 刷新页面：`window.location.reload();`
+ 后退：`window.history.back();`
+ 前进：`window.history.forward();`

#### 子窗体与父窗体对象的引用
考虑以下场景：在一个页面中弹出一个子页面，在操作完成后即关闭子页面并刷新父页面。这个场景会在登录页面中十分常见，我们希望当用户登陆完成后刷新父页面，因此需要引用父对象，若在同源页面（浏览器的同源保护策略）即可对子页面进行以下方法的调用：

```
function dealOk() {
  window.opener.location.reload();
  window.close();
}
```

若是引入第三方的页面，如qq互联接口，则无法直接通过opener获取到父对象进行操作，我们可以通过轮询子窗体状态进行控制：

```

// showPopup会返回window对象，原理是window.open()方法的调用
const childrenWindow = QC.Login.showPopup({
  appId: APPID,
  redirectURI: REDIRECT_URI,
});

const timer = setInterval(() => {

  // 查看窗体是否被关闭
  if (childrenWindow.closed) {
    clearInterval(timer); // 清除轮询
    window.location.reload(); // 刷新页面
  }
},500);
```

#### a标签阻止其跳转
将a标签的href值设为undefined，就可以阻止其跳转，void函数会执行一个表达式，并只返回undefined，我们也可以通过执行`;`直接返回undefined：

+ `<a href="javascript:void(0);">点击不会进行跳转</a>`
+ `<a href="javascript:;">点击不会进行跳转</a>`
