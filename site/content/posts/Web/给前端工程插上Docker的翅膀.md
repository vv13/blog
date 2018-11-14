---
title: "给前端工程插上Docker的翅膀"
date: 2018-11-11T23:01:15+08:00
tags: ['Web']
---
# 给前端工程插上Docker的翅膀

> What Docker/Why Docker/Install Docker，略

没错，作者很懒...，总而言之，你需要Docker来编译前端工程，也需要Docker来启动静态资源服务器，接下来就和大家一起来实践一下。

## Step 1：启动Nginx容器

执行`docker pull nginx`，即可从[远程仓库](https://hub.docker.com/)中拉取标记为latest（一般为最近更新版本）的nginx镜像，此时可通过`docker images`查看本地镜像：

```
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
nginx               latest              dbfc48660aeb        2 weeks ago         109MB
```

首先通过`docker run`命令结合一些参数来跑一个容器服务吧：`docker run -d --rm -p 3333:80 --name nginx-demo nginx`，访问`http://localhost:3333`：

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

没错，启动一个Nginx服务就是那么简单。

### Step 2：使用Nginx容器

为了使用Nginx，我们需要做两件事：

1. 更新Nginx中的静态资源文件
2. 自定义Nginx配置文件

我们先进入到容器的shell环境查看一下基本的配置信息：

```
$ docker exec -it nginx-demo sh
```

其中，docker exec用于在运行的容器中执行命令，还使用了一些参数：

- -i，保持STDIN打开
- -t，分配一个TTY终端

进入到系统中以后，很容易找到路径为`/etc/nginx/conf.d/default.conf`的文件：

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

这样我们就能知道Nginx的服务路径了，之后我们可以采用挂载的方式，将本机的文件路径挂载到容器内对应路径，这样通过修改主机的文件，Nginx也会进行相应的更新。为了验证是否配置成功，首先我们来创建一个`~/nginx-demo`文件夹与`~/nginx-demo/index.html`文件：

```
$ cd ~ && mkdir nignx-demo && cd nginx-demo && echo '<h1>Hello World</h1>' > index.html
```

然后停掉之前的容器，再重新启动，并附上挂载路径：

```
$ docker stop nginx-demo
$ docker run -d  --rm -p 3333:80 \
	-v ~/nginx-demo:/usr/share/nginx/html \
	--name nginx-demo nginx
$ curl http://localhost:3333
<h1>Hello World</h1>
```

-v参数指将主机目录挂载到容器目录，除此以外，我们还想同时自定义`/etc/nginx/conf.d/default.conf`，通过`docker cp`将它拷贝到`~/docker-nginx/`进行修改：

```
$ docker cp nginx-demo:/etc/nginx/conf.d/default.conf ~/docker-nginx/default.conf
```

在这里仅仅为了测试，因此将location改为/hello-world/，期望当访问`http://localhost:3333/hello-world/`也能返回正确的结果，修改后的配置文件为：

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

现在再需要重新构建容器，并将Nginx配置文件也从主机挂载到容器中：

```
$ docker stop nginx-demo
$ docker run -d --rm -p 3333:80 \
	-v ~/nginx-demo:/usr/share/nginx/html \
	-v ~/nginx-demo/default.conf:/etc/nginx/conf.d/default.conf \
	--name nginx-demo nginx
$ curl -L http://localhost:3333/hello-world/
<h1>Hello World</h1>
```

如果你和我一样，感觉每次执行 `docker run `携带一大堆参数不太优雅，那就试试`docker-compose`吧，它是一种YAML配置文件，主要的职责是完成容器的编排，当然也可以为容器的运行配置一些参数，为了实现相同的效果，于是乎得到了下面的`docker-compose.yml`文件：

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

进入到项目，执行`yarn build`，即可在根目录生成`build`目录。我们首先采取以下步骤：

1. 编译前端项目。
2. 将编译后的文件拷贝到Nginx镜像，如有需要你也可以创建一个nginx文件，拷贝到镜像中替换掉默认配置。

因此，我们写一个最简单的Dockerfile：

```
FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY build/ /usr/share/nginx/html

EXPOSE 80
```

相信不用解释大家也明白指令的意义，在这里用COPY代替了之前的挂载文件夹的方式，我们现在就在跑一下这个容器吧：

```
$ docker build --tag react-app .
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
react-app           latest              f151ab2c873e        6 seconds ago       110MB
$ docker run --rm -p 3333:80 react-app
```

此时访问http://localhost:3333 ，恭喜你运行成功。在通常构建流程中，我们也会**将编译所需环境与编译脚本集成进构建镜像**步骤中，因此上述Dockerfile可改写为：

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
