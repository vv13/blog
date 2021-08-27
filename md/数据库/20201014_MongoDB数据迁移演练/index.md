---
layout: 'post'
title: 'MongoDB 数据迁移演练'
date: '2020-10-14'
---

为了将本地的 Docker 中的 MongoDB 中的测试数据迁移到开发服务器，本文记录了使用 MongoDB 自带的 `mongodump` 和 `mongorestore` 命令工具进行迁移的过程，以免遗忘。

## 环境准备

为了模拟整个命令执行的过程，首先需要确保本地具有 Docker 的环境，我们在这里通过初始化两个 MongoDB 容器来进行演练。

然后让我们来做一些环境初始化的工作，通过脚本进行初始化两个容器：

```jsx
docker run -d --name migrate-from \
    -e MONGO_INITDB_ROOT_USERNAME=migrate \
    -e MONGO_INITDB_ROOT_PASSWORD=from \
		-p 27018:27017 \
    mongo:4.2
docker run -d --name migrate-to \
    -e MONGO_INITDB_ROOT_USERNAME=migrate \
    -e MONGO_INITDB_ROOT_PASSWORD=to \
		-p 27019:27017 \
    mongo:4.2
```

现在我们拥有两台 MonogDB 服务了，[Connect Url](https://docs.mongodb.com/manual/reference/connection-string/) 分别为：

- `mongodb://migrate:from@localhost:27018/admin`
- `mongodb://migrate:to@localhost:27019/admin`

对应容器状态：

```bash
➜ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
c64675fb8f63        mongo:4.2           "docker-entrypoint.s…"   12 minutes ago      Up 12 minutes       0.0.0.0:27018->27017/tcp            migrate-from
81bb50471092        mongo:4.2           "docker-entrypoint.s…"   12 minutes ago      Up 12 minutes       0.0.0.0:27019->27017/tcp            migrate-to
```

现在进入到容器内，在 migrate-from 数据库中添加一条待迁移的数据：

```jsx
docker exec -it migrate-from /bin/bash # 进入容器内部
mongo --port 27017  --authenticationDatabase "admin" -u "migrate" -p "from" # 进入到数据库命令洁面
use admin
db.createCollection('migrate')
db.migrate.insertOne({name: 'hello', value: 'world'})
```

此时可在 Mongo 客户端中进行查看数据操作：

![](./0.png)

## 数据备份

备份 MongoDB 的数据有许多种方案，在这篇文章中仅仅是简单的使用 `mongodump` ，它是官方提供的一个数据库备份工具，适合处理数据量较小的数据库。

常用的 `mongodump` 命令选项为：

- `--uri=<connectionString>`，直接指定连接字符串
- `--host=<hostname><:port>, -h=<hostname><:port>` ，主机名，若不指定，则默认指向 localhost 的27017 端口
- `--port=<port>` ，端口号，默认27017
- `--authenticationDatabase=<dbname>` ，指定授权认证数据库，默认授权认证数据库为 admin
- `--username=<username>, -u=<username>` ，用于授权认证的用户名
- `--password=<password>, -p=<password>` ，用户授权认证的密码
- `-out=<path>, -o=<path>` ，指定数据库生成 BSON 备份文件输出的位置
- ...

那么回到之前 migrate-from 容器，我们来执行备份命令，连接数据服务并将文件备份到 `/backup` 目录：

```bash
root@c64675fb8f63:/# mongodump --uri=mongodb://migrate:from@localhost:27017/admin -o /dump
2020-10-13T15:42:24.200+0000	writing admin.system.users to /dump/admin/system.users.bson
2020-10-13T15:42:24.201+0000	done dumping admin.system.users (1 document)
2020-10-13T15:42:24.202+0000	writing admin.system.version to /dump/admin/system.version.bson
2020-10-13T15:42:24.203+0000	done dumping admin.system.version (2 documents)
2020-10-13T15:42:24.204+0000	writing admin.migrate to /dump/admin/migrate.bson
2020-10-13T15:42:24.205+0000	done dumping admin.migrate (1 document)  
```

当备份完成后，我们还需要做一项工作，将生成的备份文件从容器 migrate-from 拷贝到 migrate-to，在这里我们会使用到 `docker cp` 命令，先来简单看看用法：

```bash
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-
docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
```

在这个简单场景里，我们把容器内的备份文件拷贝到宿主机，再将宿主机拷贝到另一个容器即可：

```bash
docker cp migrate-from:/dump  ./dump
docker cp ./dump migrate-to:/dump
rm -rf ./dump
```

## 数据迁移

最后一步，通过 `mongorestore` 即可完成数据的迁移，该命令常用的参数如下：

- `uri` 、`host` 、`port` 、`authenticationDatabase` 、`username` 、`password` 等与 mongodump 使用方法一致
- `-db=<database>, -d=<database>` ，指定数据库的名称，如果数据库不存在 MongoDB 会自动创建
- `-collection=<collection>, -c=<collection>` ，指定集合的名称，用于从单个 BSON 对应的集合恢复数据时使用
- ...

现在，就来完成最后的一步操作吧，将备份文件恢复到 MongoDB 数据中：

```bash
mongorestore /dump --uri=mongodb://migrate:to@localhost:27017/admin
```

执行完成后，使用 robo3T 或者任何客户端系统查看一下结果吧：

![](./0.png)

最后不要忘记清理容器哦。

## 写到最后

本文主要是在介绍 `mongodump` 与 `mongorestore` 两个命令的基本操作，可想而知，还有更多复杂的场景与高效的方法去做这件事情，之后希望能遇到更多的业务场景去做实施与优化吧。

## 参考文章

- [mongodump — MongoDB Database Tools](https://docs.mongodb.com/v4.2/reference/program/mongodump/)
- [mongorestore — MongoDB Database Tools](https://docs.mongodb.com/v4.2/reference/program/mongorestore/)

