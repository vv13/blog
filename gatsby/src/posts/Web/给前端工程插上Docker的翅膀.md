---
title: "给前端工程插上Docker的翅膀"
date: 2018-11-11T23:01:15+08:00
tags: ['Web']
---
> What Docker / Why Docker / Install Docker，请自行查阅相关资料。

一个不包含Docker的前端工程，是不会飞的，因此我们需要强行插上翅膀，即使你之前`npm run build && rsync`一把梭是多么的高效，这样不仅仅是为了效率与可维护性，单单是从逼格的角度，你也应该尽快使用Docker部署你的前端应用。

## Step 1：初始Nginx容器
Nginx是一个轻量级的Web服务器，用它来部署前端应用再好不过了，因此我们先将Nginx的镜像拉取到本地：
```
$ docker pull nginx
```
命令执行时，会从[远程仓库](https://hub.docker.com/)中拉取标记为latest（一般为最近更新版本）的nginx镜像，你可以运行命令查看本地镜像：

```
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
nginx               latest              dbfc48660aeb        2 weeks ago         109MB
```
现在让我们来运行一下吧：`docker run -d --rm -p 3333:80 nginx`，访问`http://localhost:3333`可以看到：

```
Welcome to nginx!
If you see this page, the nginx web server is successfully installed and working. Further configuration is required.

For online documentation and support please refer to nginx.org.
Commercial support is available at nginx.com.

Thank you for using nginx.
```

这里涉及到以下参数：
- `--rm`，退出时自动删除容器
- `-p`，将容器的端口发布到主机的端口，3333:80代表将容器的80端口映射到主机的3333端口
- `-d`，后台运行

没错，启动一个Nginx服务就是那么简单，`docker run` 用法很多，在此就不一一介绍了。

## Step 2：配置Nginx容器
当Nginx容器运行时，配置文件、静态资源目录都是在容器内部的，因此我们需要想办法将其中的文件进行修改，首先先进入到容器的shell环境查看一下基本的配置信息：

```
$ docker exec -it nginx-demo sh
```

其中，docker exec用于在运行的容器中执行命令，还使用了一些参数：

- -i，保持STDIN打开
- -t，分配一个TTY终端

当进入到系统中以后，按照Nginx默认路径，很容易找到路径为`/etc/nginx/conf.d/default.conf`的文件内容：

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

这样我们获取到了两个路径：
1. default.conf路径：`/etc/nginx/conf.d/default.conf/usr/share/nginx/html`
2. 静态资源服务路径：`/usr/share/nginx/html`

那我们可不可以将主机的目录文件映射到容器内呢？答案当然是可以的，这时候`-v / --volume`出场了，它说老子就是专门干这件事情的。

为了测试，首先在根目录下创建一个名为nginx-demo的文件夹，并初始化index.html文件：
```
$ cd ~ && mkdir nignx-demo && cd nginx-demo && echo '<h1>Hello World</h1>' > index.html
```

然后我们启动Nginx容器，并附上一些参数：
```
$ docker run -d --rm -p 3333:80 \
	-v ~/nginx-demo:/usr/share/nginx/html \
	--name nginx-demo nginx

```
在此又新增了几个参数：
- `-d`，后台运行容器
- `--name`，给容器命名
- `-v`，系统卷映射


让我们来验证一下：
```
$ curl http://localhost:3333
<h1>Hello World</h1>
```

若要自定义Nginx配置文件也同理，为了修改方面，可以使用`docker cp`将它拷贝到`~/docker-nginx/`在原有基础上进行进行修改：
```
$ docker cp nginx-demo:/etc/nginx/conf.d/default.conf ~/docker-nginx/default.conf
```

修改后的文件为：
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
为了测试修改成功与否，将location改为/hello-world/，这样的话，当访问`http://localhost:3333/hello-world/`即可获取正确的响应，因为之前的容器还在运行，因此我们需要先停掉之前的容器，再重新运行即可：

```
$ docker stop nginx-demo
$ docker run -d --rm -p 3333:80 \
	-v ~/nginx-demo:/usr/share/nginx/html \
	-v ~/nginx-demo/default.conf:/etc/nginx/conf.d/default.conf \
	--name nginx-demo nginx
$ curl -L http://localhost:3333/hello-world/
<h1>Hello World</h1>
```

如果你和我一样，感觉每次执行 `docker run `携带一大堆参数不太优雅，那就试试`docker-compose`工具吧（请自行安装），它主要的职责是完成容器的编排，当然也可以配置启动参数，为了实现相同的效果，于是乎得到了下面的`docker-compose.yml`文件：

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

docker-compose还有一些常用命令：

- `docker-compose up -d`，创建并启动容器
- `docker-compose down`，停止并删除容器
- `docker-compose --help`，查看帮助

相信你可以通过上述命令让你的容器飞起来。

## Step 3：使用Dockerfile构建工程镜像

在这里就直接使用[create-react-app](https://github.com/facebook/create-react-app)先创建一个前端工程：

```
$ npx create-react-app react-app
```

我们希望直接通过上述学到的启动Nginx容器先运行一下服务，因此首先执行`yarn build`手动编译，这时会在根目录下生成编译目录：`build/`，此时在根目录下添加docker-compose.yml：
```
services:
  web:
    image: nginx
    container_name: docker-app
    ports:
      - 3333:80
    volumes:
      - ~/react-app/build:/usr/share/nginx/html
```
执行`docker-compose up -d`，create-react-app项目已经正常运行在你的容器里了。以上是通过各种手段直接构建的容器，现在我们换一种方式，直接构建镜像，构建镜像一般是通过Dockerfile来构建，那我们来写一个Dockerfile文件"替换"掉docker-compose.yml：
```
FROM nginx

COPY build/ /usr/share/nginx/html

EXPOSE 80
```
在这里最主要的是通过过COPY命令替代了`--volume`参数，我们先构建镜像，构建好以后，就可以直接通过镜像运行容器了，此时可直接运行镜像：

```
$ docker build --tag react-app .
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
react-app           latest              f151ab2c873e        6 seconds ago       110MB
$ docker run --rm -p 3333:80 react-app
```

访问http://localhost:3333 ，恭喜你运行成功。在通常构建流程中，我们也会**将编译所需环境与编译脚本集成进构建镜像**步骤中，因此上述Dockerfile可改写为：

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

node的镜像版本号一定要采用-alpine后缀的，这样构建的镜像会节约很多空间，因为它是基于 [Alpine Linux](http://alpinelinux.org/)项目，它是一个轻量级Linux发行版本。

当我们重新构建完镜像后，自行验证一下吧。需要注意的是，当你在构建时无意中会把`node_modules、.git`之类的文件夹一起放到构建上下文之中，这样会影响到构建速度与镜像大小，这时候`.dockerignore`文件就排上用场啦，它能帮助你去定义构建环境中你真正需要的文件，在这里也为工程简单配置了一下：

```
node_modules
.git
```

## 参考资料

- [How To Run Nginx in a Docker Container on Ubuntu 14.04 | DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-run-nginx-in-a-docker-container-on-ubuntu-14-04)
- [Create React App + Docker — multi-stage build example. Let’s talk about artifacts!](https://medium.com/@shakyShane/lets-talk-about-docker-artifacts-27454560384f)
- [Do not ignore .dockerignore (it’s expensive and potentially dangerous)](https://codefresh.io/docker-tutorial/not-ignore-dockerignore/)
