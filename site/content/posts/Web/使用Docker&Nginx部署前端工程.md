---
title: "使用Docker&Nginx部署前端工程"
date: 2018-11-11T23:01:15+08:00
---

![](./fe_pipeline.jpg)

以上是现今前后端分离的项目最流行的前端工作流了，部署对于FEer来讲多么清晰简单(build、rsync一把梭)，职责划分明确(页面访问不了？问后端去)，这使得前端工程师们乐开了花。今天我们来聊聊，除此之外前端部署还能怎么玩。

通篇其实没有讲什么相关概念，希望你能多结合文档扩展一下，本文仅仅是希望提供一种实践的方式带大家在前端工程中去熟悉一下Docker。

## Step 1：启动Nginx容器

通过`docker pull nginx`，即可从[远程仓库](https://hub.docker.com/)中拉取标记为latest（一般为最近更新版本）的nginx镜像，此时可通过`docker images`查看本地镜像：

```
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
nginx               latest              dbfc48660aeb        2 weeks ago         109MB
```

现在就可以简单通过镜像运行一个容器服务：`docker run -d --rm -p 3333:80 --name nginx-demo nginx`，访问`http://localhost:3333`即可看到：

```
Welcome to nginx!
If you see this page, the nginx web server is successfully installed and working. Further configuration is required.

For online documentation and support please refer to nginx.org.
Commercial support is available at nginx.com.

Thank you for using nginx.
```

当执行run的时候，有几个参数需要说明一下：

- --name，命名容器id
- -d，后台运行此容器
- --rm，退出时自动删除容器
- -p，将容器的端口发布到主机的端口，3333:80代表将容器的80端口映射到主机的3333端口

### Step 2：配置Nginx容器
为了更灵活的使用Nginx，我们首先需要自定义Nginx配置文件，其次要将静态资源目录挂载出来，方便我们前端文件可以在容器外部进行实时更新，而无需重新构建容器。

首先，我们进入到容器的bash环境查看一下基本的配置信息：

```
$ docker exec -it nginx-demo sh
```

其中，docker exec用于在运行的容器中执行命令，i参数部分如下：

- -i，保持STDIN打开
- -t，分配一个TTY终端

当进入到shell终端环境后，很容易找到路径为`/etc/nginx/conf.d/default.conf`的文件：

```
# 已去掉文件注释
server {
    listen       80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

为了将静态资源的根路径挂载出来，我们将容器停掉后重新创建，并把系统中的/nginx-demo/的文件夹挂载到容器内的/usr/share/nginx/html/：

```
$ docker stop nginx-demo
$ docker run -d  --rm -p 3333:80 \
	-v ~/nginx-demo:/usr/share/nginx/html \
	--name nginx-demo nginx
$ cd ~/nginx-demo && touch index.html && echo '<h1>Hello World</h1>' > index.html
$ curl http://localhost:3333
<h1>Hello World</h1>
```

其中，-v参数就是用于将主机目录挂载到容器目录下的，同理可得，若在Nginx有使用到SSL证书、或是要自定义配置文件也可以通过此参数进行挂载。

为了修改配置文件，先通过`docker cp`将它拷贝到`~/docker-nginx/`进行修改：

```
$ docker cp nginx-demo:/etc/nginx/conf.d/default.conf default.conf
```

修改后的default.conf为：

```
server {
    listen       80;
    server_name  localhost;
    root   /usr/share/nginx/html;

    location /hello-world/ {
        alias   /usr/share/nginx/html/;
        index index.html;
    }
}
```

现在需要重新构建容器，将默认配置文件也挂载到容器中：

```
$ docker stop nginx-demo
$ docker run -d --rm -p 3333:80 \
	-v ~/nginx-demo:/usr/share/nginx/html \
	-v ~/nginx-demo/default.conf:/etc/nginx/conf.d/default.conf \
	--name nginx-demo nginx
$ curl -L http://localhost:3333/hello-world/
<h1>Hello World</h1>
```

如何你和我一样，感觉每次执行 `docker run `携带一大堆参数不太优雅，那就试试`docker-compose`吧，它是一种YAML配置文件，主要的职责是完成容器的编排，当然也可以为容器的运行配置一些参数，让我们先为上述启动方式写一个`docker-compose.yml`文件：

```
services:
  web:
    image: nginx
    container_name: nginx-demo
    ports:
      - 3333:80
    volumes:
      - ~/nginx-demo:/usr/share/nginx/html
      - ~/nginx-demo/default.conf:/etc/nginx/conf.d/default.conf
```

docker-compose有一些常用命令：

- `docker-compose up -d`，创建并启动容器
- `docker-compose down`，停止并删除容器
- `docker-compose --help`，查看帮助

无需测试，相信你可以通过上述命令让你的容器飞起来。

## Step 3-1：使用Dockerfile构建工程镜像

与Step2的思路一样，首先希望使用Dockerfile替换`docker run`的一堆参数，在这里先采用容器外编译的方法，也就是先执行`yarn build`在根目录生成`build/`目录，再创建一个`nginx.conf`，保证根目录结构为：

```
.
├── Dockerfile
├── build/
├── nginx.conf
├── ...
```

此时根据之前的run参数，我们写一个最简单的Dockerfile：

```
FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY build/ /usr/share/nginx/html

EXPOSE 80
```

相信不用解释大家也明白指令的意义，在这里只是用COPY代替了之前的挂载文件夹的方式，我们现在就在主机上运行一下这个容器吧：

```
$ docker build --tag react-app .
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
react-app           latest              f151ab2c873e        6 seconds ago       110MB
$ docker run --rm -p 3333:80 react-app
```

此时访问http://localhost:3333，你应该能看到React欢迎页面。上述流程还缺少一个步骤，那就是编译。在正常构建流程中，我们也会**将编译所需环境与脚本集成进构建镜像**步骤中，因此上述Dockerfile可改写为：

```
# stage 1
FROM node:11-alpine as build-deps
WORKDIR /usr/src/app
COPY . .
RUN yarn && yarn build

# stage 2
FROM nginx
COPY build/ /usr/share/nginx/html

EXPOSE 80
```

需要注意的是，node的镜像版本号采用的是：11-alpine，因为它是基于 [Alpine Linux](http://alpinelinux.org/)项目，使用它构建出来的镜像只有5M，会比普通系统镜像小的多。

当我们重新构建完镜像后，可通过之前的步骤启动验证一下。当你在构建时无意中会把`node_modules、.git`之类的文件夹一起放到构建上下文之中，这样会影响到构建速度与镜像大小，这时候`.dockerignore`文件就排上用场啦，它能帮助你去定义构建环境中你真正需要的文件，在这里也为工程简单配置了一下：

```
node_modules
.git
```

## 参考资料

- [How To Run Nginx in a Docker Container on Ubuntu 14.04 | DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-run-nginx-in-a-docker-container-on-ubuntu-14-04)








