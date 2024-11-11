起因是因为装了个min的linux系统，啥也没有。。。用啥都难受的一批

```bash
 bash: fdisk: 未找到命令
```

  解决办法：将fdisk添加到命令搜索路径中

***\* 方法如下：\****

 查看当前的命令搜索路径

```bash
[root@VM-8-15-centos ~]# echo $PATH

 /usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games
```



 查找fdisk命令在哪个路径下



 ```bash
 [root@VM-8-15-centos ~]# whereis fdisk
 
  fdisk: /sbin/fdisk /usr/share/man/man8/fdisk.8.gz
 ```

 

 可以看到fdisk命令不在当前的命令搜索路径里，将fdisk命令添加到当前命令搜索路径中即可

```bash
[root@VM-8-15-centos ~]# sudo ln -s /sbin/fdisk /usr/local/bin
```

