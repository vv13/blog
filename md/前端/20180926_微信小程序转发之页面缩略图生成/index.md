---
date: '2018-09-26'
title: "微信小程序转发之页面缩略图生成"
tags: ["Weapp"]
---

## onShareAppMessage

onShareAppMessage用于定义Page页面的转发内容，且只有定义了此函数才能触发转发操作，它会在转发时执行。转发有两种触发方式：

1. 点击右上角菜单栏里的转发按钮，可通过wx.hideShareMenu()或wx.showShareMenu()进行隐藏、显示按钮。
2. 通过给 `button` 组件设置属性 `open-type="share"`，可以在用户点击按钮后触发事件。

onShareAppMessage函数要求返回一个对象，内容为：

| 字段     | 说明                                                         | 默认值                                    | 最低版本                                                     |
| -------- | ------------------------------------------------------------ | ----------------------------------------- | ------------------------------------------------------------ |
| title    | 转发标题                                                     | 当前小程序名称                            |                                                              |
| path     | 转发路径                                                     | 当前页面 path ，必须是以 / 开头的完整路径 |                                                              |
| imageUrl | 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。 | 使用默认截图                              | [1.5.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |

若不返回imageUrl字段，微信小程序默认会取当前页面，从顶部开始，高度为 80% 屏幕宽度的图像作为转发图片。

## 默认截图存在的问题

采用默认截图通常用于对分享图片要求不高的场景，或者恰好满足截图需求，你可能遇到过以下场景：

- 需要转发出去的页面不是当前触发分享的页面
- 需要从页面顶部开始截图，可当滚动到页面中部时，只能从当前视窗开始截图
- 当我们想要隐藏页面的部分元素，不希望分享截图携带某些元素，怎么处理呢？

由以上可知，大部分情况，转发页面的功能都应该使用自定义图片的，并且自定义图片应该单独按照的设计，独立于页面，建议尺寸为：`750rpx x 600rpx`。若你需要分享的页面的自定义图片可以是固定的某张图片，那恭喜你已经可以不用往下看了，但对于大多数应用来说，分享截图往往携带动态的数据等，此时该如何解决呢？

## 利用Canvas来生成截图

转到绘图API，我们可以找到[canvasToTempFilePath](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/temp-file.html)函数，它能将当前画布导出为图片，因此我们的方案为：

1. 在Page页面创建一个隐藏元素canvas。
2. 使用canvas API进行绘制分享截图。
3. 绘制完成后调用canvasToTempFilePath生成图片路径后存到data里，在onShareAppMessage里获取图片并作为imageUrl字段返回。

如果没有思路的同学，在这里我会使用原生小程序教大家来做一个分享的步骤，首先打开新建好的项目，在index.wxml添加一个canvas元素：

```
<canvas style="width: 100%;height: 600rpx;position: absolute;top: -1000px;" canvas-id="sharebg" ></canvas> 
```

需要注意的是在这里我们通过绝对定位将画布隐藏起来了。在一般的场景下，当绘制函数所依赖的数据发生变化时，则需要重新执行绘制函数，因此在此我们通过getUserInfo按钮，当获取到最新用户信息时，执行绘画元素：

```
  data: {
      shareImage: null
  },
  onShareAppMessage() {
    return { title: "test", imageUrl: this.data.shareImage };
  },
  
  // bindgetuserinfo函数
  getUserInfo: function(e) {
    // 绘制逻辑
    this.drawCard(e.detail.userInfo);
  },
```

既然将用户信息传入了drawCard函数，那就来绘制一个头像+姓名吧，在调试阶段我们可以先取消绝对定位，由于获取到的头像是一个三方链接，我们在绘制前需要先通过`wx.downloadFile`进行下载，否则会出现绘制不出图形的情况，在这里简单封装一个Promise对象，在依赖多张图片资源时可通过`Promise.all`进行获取：

```
  downloadFilePromise(url) {
    return new Promise((resolve, reject) => {
      if (!url) {
        resolve("");
      } else {
        wx.downloadFile({
          url,
          success: data => {
            resolve(data);
          },
          fail: err => {
            reject(err);
          }
        });
      }
    });
  },
```

需要注意的是，为了避免绘画工作过于繁重，在切图与设计时，应该多与设计师沟通，最理想的情况就是只绘制一张背景图，然后将动态数据进行绝对定位即可。为了把话讲完，在此随意绘制一下，请不要怀疑我的审美：

```
  drawCard({ nickName, avatarUrl }) {
    const ctx = wx.createCanvasContext("card");
    this.downloadFilePromise(avatarUrl).then(({ tempFilePath }) => {
      ctx.save();
      ctx.font = 'bold 22px sans-serif';
      ctx.setFontSize(22);
      ctx.setFillStyle('#333');
      ctx.fillText(nickName, 0, 22);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(150, 50, 50, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(tempFilePath, 100, 0, 100, 100);
      ctx.restore();

      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId: "card",
          quality: 1,
          success: ({ tempFilePath }) => {
            this.setData({
              shareImage: tempFilePath
            });
          }
        });
      });
    });
  },
```

当绘制工作完成后，即可通过扫码预览，打开调试模式，点击获取用户信息后进行转发，希望你能看到以下图片：

![](./29117968.jpg)

至此动态生成转发截图就算完成了，希望能对你提供一些帮助。
