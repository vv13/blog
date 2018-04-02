---
layout: post
title: git实用命令技巧
date: 2016-12-11
tags: ['tricks']
---

## git pull --rebase
从分支上拉取最新的代码时，往往会多出一条merge记录，这样有时不是我们所期望的，因为它会让整个提交线图变得难以理解：

![](/static/imgs/git实用命令技巧-1.png)

我们期望的分支图也许时这样的：

![](/static/imgs/git实用命令技巧-2.png)

只需要将git pull -> git pull --rebase。rebase的好处就在于，它会将当前新的提交记录，全部追加到远程提交信息记录之后:
```
合并前：
        D---E master
      /
A---B---C---F origin/master

merge合并：
    D--------E  
  /           \
A---B---C---F---G   master, origin/master

rebase合并：
A---B---C---F---D---E   master, origin/master
```

如果遇到冲突，请将冲突解决后执行: `git rebase --continue`。它也有两面性，至于谁好谁坏，慎用就行了。

## git commit --amend
有时候我们生成commit信息后有点小的改动，并不希望新添加一个commit，而是将其追加到上一次提交内容中，这条命令就是为了做这件事情，它还可以更改之前的提交信息。

## 获取远程库的更新
普通的工作流程一般是先folk整个工程到本地，再添加上游分支：
```
git remote add upstream https://xxx.git
```

这样一来，我们就可以获取远程的更新到当前分支：
```
git pull upstream master
```

若拉取本地不存在的分支，则可以使用这条命令：
```
git checkout -b new_branch upstream/new_branch
```

## 推送多个远程库
用法：

```
$ vim ~/.git/config

[remote "upstream"]
        url = git@gitlab.main.com:project.git
        url = git@github.main.com:project.git

$ git push upstream
```

解释：通过编辑config文件，给远程库多添加一个url，那么再执行push操作时，就可以同时push两个库，如上github与gitlab仓库的项目都会更新。

## 合并多个提交
有些时候，本地会做多个commit提交，但是在push之前，合并为1个提交会显得更清晰，此时就需要借助`git rebase -i HEAD~N`了，其中N代表的是最近几次提交，执行后将需要合并的commit从pick改为squash，再重写提交记录即可。

## 更改提交人
在有一次和小伙伴协作代码时，由于需要伪造成同一个身份，让代码管理者看commit历史以为是同一个人做的，因此就用到了--author参数，提交的格式为：`name<mail>`，比如：`git commit -m 'feat: something' --author="TJ<mail@gmail.com>"`，这是通过git log即可看到作者信息发生了变化。

## 其他

- 删除远程分支：$ git push origin --delete <branchName>

- 推送本地分支：$ git push <远程主机名> <本地分支名>:<远程分支名>
