## git

### 创建仓库命令

| 命令        | 说明                                   |
| :---------- | :------------------------------------- |
| `git init`  | 初始化仓库                             |
| `git clone` | 拷贝一份远程仓库，也就是下载一个项目。 |

### 提交与修改

| 命令                                | 说明                                     |
| :---------------------------------- | :--------------------------------------- |
| `git add`                           | 添加文件到暂存区                         |
| `git status`                        | 查看仓库当前的状态，显示有变更的文件。   |
| `git diff`                          | 比较文件的不同，即暂存区和工作区的差异。 |
| `git difftool`                      | 使用外部差异工具查看和比较文件的更改。   |
| `git range-diff`                    | 比较两个提交范围之间的差异。             |
| `git commit`                        | 提交暂存区到本地仓库。                   |
| `git reset`                         | 回退版本。                               |
| `git rm`                            | 将文件从暂存区和工作区中删除。           |
| `git mv`                            | 移动或重命名工作区文件。                 |
| `git notes`                         | 添加注释。                               |
| `git checkout`                      | 分支切换。                               |
| `git switch （Git 2.23 版本引入）`  | 更清晰地切换分支。                       |
| `git restore （Git 2.23 版本引入）` | 恢复或撤销文件的更改。                   |
| `git show`                          | 显示 Git 对象的详细信息。                |

### 远程操作

| 命令            | 说明                        |
| :-------------- | :-------------------------- |
| `git remote`    | 远程仓库操作                |
| `git fetch`     | 从远程获取代码库            |
| `git pull`      | 下载远程代码并合并          |
| `git push`      | 上传远程代码并合并          |
| `git submodule` | 管理包含其他 Git 仓库的项目 |

### git 代理设置

设置

```cmd
git config --global https.proxy 代理地址
git config --global http.proxy 代理地址
```

查看

```cmd
git config --global  --get https.proxy
git config --global  --get https.proxy
```

> 查询的时候没有打印任何东西证明没有设置代理

取消

```cmd
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## NPM

### 常用命令

| 命令            | 说明                                                         |
| :-------------- | :----------------------------------------------------------- |
| `npm install`   | 安装新的包(全局范围内安装一个包，可以使用`-g`或`--global`标志) |
| `npm uninstall` | 从项目中移除依赖包。它会从`package.json`文件中删除指定的包，并卸载它 |
| `npm update`    | 用于更新项目中的依赖包。它可以更新所有依赖包，也可以指定更新某个特定的包 |
| `npm cache`     | 管理npm的缓存（npm cache clean --force）                     |
| `npm config`    | 设置或查看npm的配置选项（查看配置：npm config list）         |

###  NPM设置代理

```cmd
npm config set proxy http://127.0.0.1:10808
npm confit set https-proxy http://127.0.0.1:10809
```

取消代理

```cmd
npm config delete proxy
npm config delete https-proxy
```

设置源（官方）

 ```cmd
 npm config set registry https://registry.npmjs.org/
 ```

设置源（淘宝）

```cmd
npm config set registry https://registry.npmmirror.com/
```

查看源

```cmd
npm get registry 
```

删除源

```cmd
npm config delete registry
```



## yarn

### 常用命令

| 命令                     | 操作                                | 参数                                                         | 标签                                                         |
| ------------------------ | ----------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| yarn add                 | 添加依赖包                          | 包名                                                         | --dev/-D                                                     |
| yarn bin                 | 显示yarn安装目录                    | 无                                                           | 无                                                           |
| yarn cache               | 显示缓存                            | 列出缓存包：`ls`，打出缓存目录路径：`dir`，清除缓存：`clean` | 无                                                           |
| yarn check               | 检查包                              |                                                              |                                                              |
| yarn clean               | 清理不需要的依赖文件                |                                                              |                                                              |
| yarn config              | 配置                                | 设置：`set <key> <value>`， 删除：`delete`， 列出：`list`    | [-g \| --global]                                             |
| yarn generate-lock-entry | 生成锁定文件                        | 无                                                           | 无                                                           |
| yarn global              | 全局安装依赖包                      | yarn global <add/bin/ls/remove/upgrade> [--prefix]           | --prefix 包路径前缀                                          |
| yarn info                | 显示依赖包的信息                    | 包名                                                         | --json：json格式显示结果                                     |
| yarn init                | 互动式创建/更新package.json文件     | 无                                                           | --yes/-y：以默认值生成package.json文件                       |
| yarn install             | 安装所有依赖包                      |                                                              | --flat：只安装一个版本；--force：强制重新下载安装；--har：输出安装时网络性能日志；--no-lockfile：不生成yarn.lock文件；--production：生产模式安装（不安装devDependencies中的依赖） |
| yarn list                | 列出已安装依赖包                    |                                                              | --depth=0：列表深度，从0开始                                 |
| yarn outdated            | 检查过时的依赖包                    | 包名                                                         |                                                              |
| yarn pack                | 给包的依赖打包                      | --filename                                                   |                                                              |
| yarn publish             | 将包发布到npm                       |                                                              | --tag：版本标签；--access：公开（public）还是限制的（restricted） |
| yarn remove              | 卸载包，更新package.json和yarn.lock | 包名                                                         |                                                              |
| yarn upgrade             | 升级依赖包                          |                                                              |                                                              |
| yarn version             | 管理当前项目的版本号                | --new-version ：直接记录版本号；--no-git-tag-version：不生成git标签 |                                                              |

###  yarn设置代理

设置源（淘宝）

```cmd
yarn config set registry https://registry.npmmirror.com/
```

设置源（官方）

```cmd
yarn config set registry https://registry.yarnpkg.com
```

删除源

```cmd
yarn config delete registry
```

查看代理

```cmd
yarn config list
```

设置

```cmd
yarn config set proxy  http://127.0.0.1:10809
yarn config set https-proxy http://127.0.0.1:10808
```

取消

```cmd
yarn config delete proxy
yarn config delete https-proxy
```

## rimraf快速删除node_modules文件夹

全局安装：`npm install -g rimraf`

进行删除：`rimraf node_modules`

## ESLint 自动修复
`npm run lint -- --fix` 或者`yarn lint --fix`