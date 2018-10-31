---
title: jenkins部署
date: 2017-10-18
---
Jenkins是一种由Java开发的持续集成工具，称为CI(Continuous integration)，主要功能是将代码频繁地集成到主干，可以让代码快的迭代，并提高代码质量。

典型的工作流为：开发→提交→编译→测试→发布，Jenkins可以帮你完成除了开发之后的工作，实现自动化。

## Jenkins部署步骤

准备工作如下：

1. 服务器安装docker
2. 拉取镜像：`docker pull jenkins/jenkins`
3. 创建一个文件夹`jenkins_home`用于存放jenkins所有配置文件，挂载出来方便迁移，遇到权限问题可设置：`chown 1000 ./jenkins_home`

做完以上流程，即可执行：

```
docker run -d --name jenkins_node -p 8899:8080 -v /var/jenkins_home:/var/jenkins_home jenkins/jenkins
```

其中，参数如下定义：

- -d，docker进程在后台运行
- -name，docker容器名称
- -p，映射docker端口8080为本地端口8899，通过`localhost:8899`即可访问
- -v，将服务器的`/var/jenkins_home`挂载到docker容器的`/var/jenkins_home`

以上步骤都执行成功后，访问`server_ip/8899`可以看到如下页面：

![](http://qn.vv13.cn/17-10-18/84127408.jpg)

此时查询到container ID， 然后通过`docker logs id`可以查询到密钥就在log中：

```
INFO:

*************************************************************
*************************************************************
*************************************************************

Jenkins initial setup is required. An admin user has been created and a password generated.
Please use the following password to proceed to installation:

密钥密钥密钥密钥密钥密钥密钥密钥密钥密钥密钥密钥密钥密钥密钥密钥密钥密钥

This may also be found at: /var/jenkins_home/secrets/initialAdminPassword

*************************************************************
*************************************************************
*************************************************************
```
