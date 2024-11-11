---
date created: 2022-11-29 16:31
---

心血来潮，任务是将debian搭建samba服务。虽然大学学过，但是已经忘得差不多了。。。

最怕改配置文件了。。

## 下载samba

这个很重要。但是这个步骤一直告诉我依赖库有问题，我很是好奇依赖库哪里有问题，已经换成国内的镜像源。还是有依赖库的问题。以致于总是安装不上。后来才明白，这种依赖的问题大多数是源有问题，可以尝试换个源试试的。

再`/etc/apt`的`sources.list`文件，如果你不习惯使用linux的vim可以使用xshell的xftp进行文件更改。另外说一句，debian这系统和centos还不一样，需要有权限才能对文件进行操作我，我要更改系统文件的话必须加上sudo才可以。

打开`sources.list`文件之后，进行更改，添加上源

```linux
#阿里云镜像源
deb https://mirrors.aliyun.com/debian/ bullseye main non-free contrib
deb-src https://mirrors.aliyun.com/debian/ bullseye main non-free contrib
deb https://mirrors.aliyun.com/debian-security/ bullseye-security main
deb-src https://mirrors.aliyun.com/debian-security/ bullseye-security main
deb https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib
deb-src https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib
deb https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib
deb-src https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib
```

添加上之后，保存文件然后输入下面命令更新源

`sudo apt-get update`

`sudo apt-get upgrade`

#### Tips：

sudo apt-get update
这个命令，会访问源列表里的每个网址，并读取软件列表，然后保存在本地电脑。我们在新立得软件包管理器里看到的软件列表，都是通过update命令更新的。

update后，可能需要upgrade一下。

sudo apt-get upgrade
这个命令，会把本地已安装的软件，与刚下载的软件列表里对应软件进行对比，如果发现已安装的软件版本太低，就会提示你更新。如果你的软件都是最新版本，会提示：

升级了 0 个软件包，新安装了 0 个软件包，要卸载 0 个软件包，有 0 个软件包未被升级。

## 安装samba

root用户下直接使用以下命令

```bash
 apt-get install samba
```

若是普通用户下使用以下命令

```bash
 sudo apt-get install samba
```

安装好samba之后然后就是更改配置文件`/etc/samba`下面的`smb.conf`文件

## 更改samba配置文件

我主要更改了home文件下面的配置文件，appshare是我自己写的配置，可以照着写一下。

```bash
[global]
workgroup = WORKGROUP
   log file = /var/log/samba/log.%m
   max log size = 1000
   logging = file
   panic action = /usr/share/samba/panic-action %d
   server role = standalone server
   obey pam restrictions = yes
   unix password sync = yes
   map to guest = bad user #设置是否可以匿名访问
   usershare allow guests = yes
[homes]
   comment = Home Directories
   browseable = yes
   public = yes
   guest ok = yes
   read only = no
   writable = yes
   create mask = 0777
   directory mask = 0777
   valid users = %S
[appshare]
comment = WinccOA Share #描述
path = /home/uarto/app   #路径
browseable = yes   #是否可见
writable = yes #可写
available = yes
public = yes #公共
read only = no #只读，不能和上面的pulic =yes 冲突
guest ok = yes
browseable = yes
create mask = 0777
directory mask = 0777
```

再然后就是保存重启配置文件，重启samba服务就可以

`sudo systemctl  restart  smbd`

**如果出现文件夹无法访问的情况，有可能是没有给共享文件夹下赋予一定的权限，使用chmod更改文件夹权限就可以。**

## Samba服务程序中的参数以及作用

| [global]   |                                            | 全局参数。                       |
| ---------- | ------------------------------------------ | --------------------------- |
|            | workgroup = MYGROUP                        | 工作组名称                       |
|            | server string = Samba Server Version %v    | 服务器介绍信息，参数%v为显示SMB版本号       |
|            | log file = /var/log/samba/log.%m           | 定义日志文件的存放位置与名称，参数%m为来访的主机名  |
|            | max log size = 50                          | 定义日志文件的最大容量为50KB            |
|            | security = user                            | 安全验证的方式，总共有4种               |
|            | share：来访主机无需验证口令；比较方便，但安全性很差               |                             |
|            | user：需验证来访主机提供的口令后才可以访问；提升了安全性             |                             |
|            | server：使用独立的远程主机验证来访主机提供的口令（集中管理账户）        |                             |
|            | domain：使用域控制器进行身份验证                        |                             |
|            | passdb backend = tdbsam                    | 定义用户后台的类型，共有3种              |
|            | smbpasswd：使用smbpasswd命令为系统用户设置Samba服务程序的密码 |                             |
|            | tdbsam：创建数据库文件并使用pdbedit命令建立Samba服务程序的用户   |                             |
|            | ldapsam：基于LDAP服务进行账户验证                     |                             |
|            | load printers = yes                        | 设置在Samba服务启动时是否共享打印机设备      |
|            | cups options = raw                         | 打印机的选项                      |
| [homes]    |                                            | 共享参数                        |
|            | comment = Home Directories                 | 描述信息                        |
|            | browseable = no                            | 指定共享信息是否在“网上邻居”中可见          |
|            | writable = yes                             | 定义是否可以执行写入操作，与“read only”相反 |
| [printers] |                                            | 打印机共享参数                     |
|            | comment = All Printers                     |                             |
|            | path = /var/spool/samba                    | 共享文件的实际路径(重要)。              |
|            | browseable = no                            |                             |
|            | guest ok = no   等于 public = no             | 是否所有人可见，等同于"public"参数。      |
|            | writable = no    等于 read only = yes        |                             |
|            | printable = yes                            |                             |

共享选项及说明，按照需求合理配置

```bash


[共享名称]: 共享中看到的共享目录名


comment = 共享的描述. 

path = 共享目录路径(可以用%u、%m这样的宏来代替路径如:/home/share/%u) 

browseable = yes/no指定该共享是否在“网上邻居”中可见。

writable = yes/no指定该共享路径是否可写。

read only = yes/no设置共享目录为只读(注意设置不要与writable有冲突) 

available = yes/no指定该共享资源是否可用。

admin users = bobyuan，jane指定该共享的管理员,用户验证方式为“security=share”时，此项无效。 

valid users = bobyuan，jane允许访问该共享的用户或组-“@+组名” 

invalid users = 禁止访问该共享的用户与组(同上) 

write list = 允许写入该共享的用户

public = yes/no共享是否允许guest账户访问。 

guest ok = yes/no意义同“public”。

create mask = 0700指定用户通过Samba在该共享目录中创建文件的默认权限。0600代表创建文件的权限为rw-------

directory mask = 0700指定用户通过Samba在该共享目录中创建目录的默认权限。0600代表创建目录的权限为rwx------ 
```
