---
layout: post
title: LET'S ENCRYPT 笔记
date: '2019-11-21'
tags: ['笔记']
---

为了在网站中启用 HTTPS，我们需要从证书颁发机构（CA）获取证书，而Let’s Encrypt 就是一个免费、开放和自动化的证书颁发机构，具体原理请浏览[how it works](https://letsencrypt.org/zh-cn/how-it-works/)。

为了获取证书，我们需要对服务器进行一些校验与配置，这时就需要用到 [Certbot](https://certbot.eff.org/) 客户端。由于我使用的的Web 服务器为 Nginx，服务器操作系统为 Ubuntu18，若你的服务器和我的不一样，可以去官网选择不同的文档类型进行查看。

### 添加 Certbot PPA
将 Certbot 软件包添加到下载源列表里：
```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
```

### 安装 Certbot
```
sudo apt-get install certbot python-certbot-nginx
```

### 运行 Certbot
```
sudo certbot --nginx
```

此时客户端会要求输入相应 Email 与域名信息，当一切执行完成后，应该会看到如下信息，请妥善保管：
```
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
 - ...
```

### 重新生成证书
Certbot 客户端会通过系统中的定时任务去定时更新证书，若需要手动重新生成证书，请执行：
```
sudo certbot renew --dry-run
```

