---
layout: 'post'
title: '使用 Nginx 的 mirror 模块进行流量复制'
date: '2021-02-22'
tags: ['笔记']
---
# ngx_http_mirror_module

nginx 在 1.13.4 及其后续版本中内置了 ngx_http_mirror_module 模块，它会创建原始请求的镜像请求来代理到不同的服务器中进行处理，其中镜像请求的响应会被忽略。

该具有两个指令：**mirror** 与 **mirror_request_body**，在 http, server, location 的上下文中可以进行设置它们的值。

#### mirror

mirror 用于指定镜像请求的地址，可以设置多个镜像请求地址，语法为：`mirror URI`。Nginx 并不会关心镜像请求的返回结果，不论请求返回成功或者失败都会被忽略。

#### mirror_request_body

设置是否将请求中的请求体复制到镜像请求中，默认值为`mirror_request_body on`，当启用时，默认的[proxy_request_buffering](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering), [fastcgi_request_buffering](http://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_request_buffering), [scgi_request_buffering](http://nginx.org/en/docs/http/ngx_http_scgi_module.html#scgi_request_buffering) 和 [uwsgi_request_buffering](http://nginx.org/en/docs/http/ngx_http_uwsgi_module.html#uwsgi_request_buffering) 都将被禁用，若不需要此配置可将其指定为`off`。

## 示例

为了便于演示，在这里先通过 json-server 启动 3 个服务，创建一个 `db.json`：

```
{
  "posts": [
    {
      "id": 1,
      "title": "json-server",
      "author": "typicode"
    }
  ]
}
```

然后简单进行服务初始化：

```
npm i -g json-server
json-server db.json --port 3001
json-server db.json --port 3002
json-server db.json --port 3003
```

接下来，添加一个 nginx.conf 文件：

```
upstream test-server {
    server localhost:3001;
}
upstream test-server1 {
    server localhost:3002;
}
upstream test-server2 {
    server localhost:3003;
}
server {
    listen 4000;

    location / {
        proxy_pass http://test-server;
    }

    location = /posts {
        mirror /mirror-a;
        mirror /mirror-b;
        proxy_pass http://test-server;
    }

    location = /mirror-a {
        internal;
        proxy_pass http://test-server1$request_uri;
    }

    location = /mirror-b {
        internal;
        proxy_pass http://test-server2$request_uri;
    }
}

```

重载 Nginx 后，所有通过`http://localhost:4000/posts`的请求除了正常的访问 test-server，并且会被复制一份完整请求到 test-server1 与 test-server2 。
