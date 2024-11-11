2022年7月5日19点20分

因为刚修改了nginx的配置文件,清理了一下logs的文件夹。一时手贱，使用了
`rm -rf *`
在重启nginx的时候直接报错了
```bash

nginx: [error] open() "/usr/local/nginx/logs/nginx.pid" failed (2: No such file or directory)

```
提示打开失败，没有这个文件或者目录。简单分析来说就是没有nginx.pid这个文件。

##### 修复方法
1.我们可以杀死所有nginx进程，运行命令：

```bash
killall nginx 
```

2.如果报错：
```bash
-bash: killall: 未找到命令
```
运行命令：

```bash
yum install psmisc          
```

安装完毕后。然后重新运行命令
```bash
killall nginx 
```
3.这时在sbin目录下，重启nginx就可以正常运行了：

```bash
./nginx
```