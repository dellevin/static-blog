### [docker英文官网](https://docs.docker.com/)

### [docker中文官网](https://dockerdocs.cn/index.html)

### [dockerHub仓库](https://hub.docker.com/)

[docker](https://so.csdn.net/so/search?q=docker&spm=1001.2101.3001.7020)分为镜像和容器
首先将镜像pull下来
然后用`docker run`生成一个容器，生成容器时指定镜像

我这里拿centos7.x举例，安装就不举例了，根据官网安装很简单

### 基本查看命令

使用`docker -v`查看是否安装成功
![docker -v 示例](assets/docker学习使用记录/f185ea84d826494f9a2ae140f5bf61ec.png)
使用`docker images`查看镜像列表，可以看到目前是没有镜像的
![docker images 示例](assets/docker学习使用记录/5ca4c509f6b545f9b6a5e4dac45f08f5.png)
使用`docker ps`查看运行着的容器列表，可以看到目前是没有容器的
![docker ps 示例](assets/docker学习使用记录/221ea1f30d2b415ba9c863eeb559cdb0.png)
使用`docker ps -a`查看所有容器列表，`-a` 代表 `--all` 的意思，我这里举例所以搞了一个已停止的容器
![在这里插入图片描述](assets/docker学习使用记录/183f721a007f493cb349c404aef5b56e.png)
使用`docker ps -aq`仅查看所有容器的ID的列表，`-q`不知道啥意思，反正就是带上只返回ID
![查看所有容器的ID的列表示例](assets/docker学习使用记录/8e3f7614aa2a4de6bf2696f336a7a952.png)

### 拉取镜像

拿[ubuntu](https://so.csdn.net/so/search?q=ubuntu&spm=1001.2101.3001.7020)的镜像举例
在docker Hub仓库的Explore找到ubuntu，点击去之后
![docker Hub 的 ubuntu 示例](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_20,color_FFFFFF,t_70,g_se,x_16.png)
使用`docker pull ubuntu`将 ubuntu 镜像 pull 下来
![docker pull ubuntu 示例](assets/docker学习使用记录/57a48995d11c464791471c88298e6847.png)
这时候再使用`docker images`查看镜像列表就可以看到有 ubuntu 这个镜像了，这个容器之所以这么小，是因为只含有ubuntu，不存在另外的任何例如vim这种东西
![docker images 查看 ubuntu 镜像](assets/docker学习使用记录/9ba0034af47941df92668a33a5e83066.png)

### 运行容器

#### ubuntu

然后使用`docker run -it ubuntu /bin/bash`运行一个容器，容器使用 ubuntu 镜像
–name 自定义容器名称
-d 启动后在后台运行
-i 以交互模式运行容器，通常与-t一起使用
-t 运行后返回一个伪终端，通常与-i一起使用
-P 随机映射端口
-p 指定映射端口，可以有多个，例如`-p 80:80 -p 443:443`，也可以范围映射，例如`-p 8000-9000:9000-10000`
/bin/bash shell交互命令的接口，一般就只用bash或者/bin/bash即可
还有一些其他的，目前我只用到这些，以后了解了再补充
不使用`-d`的话会直接进入到ubuntu容器内部
![运行 ubuntu 容器 不带-d 示例](assets/docker学习使用记录/114e2466508b44dc9d62766ae03da111.png)
使用-d的话会返回一串id，并将启动的容器在后台运行
![运行 ubuntu 容器 带-d 示例](assets/docker学习使用记录/8780ad05c0924785a23960e00ac60a88.png)
然后在这个容器内部就可以当做一个ubuntu系统使用了

#### nginx

再说一个nginx，示例端口映射，先拉nginx的镜像
![拉取nginx镜像](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_17,color_FFFFFF,t_70,g_se,x_16.png)
然后使用`docker run -it -d -p 80:80 nginx /bin/bash`运行一个容器，镜像使用nginx镜像
这个`-d`就是指创建后在后台跑，`-p 80:80`就是指将容器内部的80端口映射到本机的80端口，在访问本机80端口时就会访问到nginx容器里的80端口的信息，可以写多个`-p`，例如`-p 80:80 -p 81:81`就是映射多个端口
![运行nginx容器示例](assets/docker学习使用记录/384bed750e7b44c49fb4b4738a11f977.png)
![进入nginx容器](assets/docker学习使用记录/68d17504e75840a7bf43b5341db39e46.png)
使用`nginx`启动nginx服务
![启动nginx服务](assets/docker学习使用记录/e161f6d6870d4d2285fc9a2b0791c167.png)
然后访问服务器ip就可以看到了
![查看页面示例](assets/docker学习使用记录/d6b22bc00f2040a98fa8f4e78a2610be.png)
nginx配置的话就不在这说了。。。

### 操作容器

1. 退出容器
   进入容器内部后可以使用`ctrl+d`或输入`exit`或输入`ctrl+p+q`退出容器
   如果进入容器的时候使用`exec`进入的，退出时容器不会停止
   如果直接`run`进入的容器，使用`ctrl+d`或`exit`退出容器时，容器会停止，使用`ctrl+p+q`不会停止
   我这里举例刚才使用了一次`-d`，所以使用`exec`进入的，退出时容器不会停止
   ![退出容器后查看运行容器](assets/docker学习使用记录/eee6b6eee81f4943a9452bf78ee0e924.png)
2. 进入已退出但还在后台运行的容器
   使用`docker attach 容器ID`或者使用`docker exec -it 容器ID /bin/bash`进入已退出的容器
   区别：使用`attach`进入容器，退出容器时容器会停止，使用`exec`进入容器，退出时容器不会停止
   ![attach进入容器退出示例](assets/docker学习使用记录/39a2af5110f946488983ce274703d838.png)
   ![exec进入容器退出示例](assets/docker学习使用记录/b03c2c8140214016aa55c65c6be86109.png)
3. 停止已退出但是还在后台运行的容器
   使用`docker stop 容器ID`停止已经退出但是还在运行的容器
   ![停止已经退出但是还在运行的容器示例](assets/docker学习使用记录/fb9c7d47360b4f219abf96808706c7bf.png)
   另外还有一个命令是`docker kill 容器ID`也是停止运行的容器
   区别：使用`stop`是让容器自行停止，`kill`是强制停止，就像电脑的关机和拔电源一样（应该吧）
4. 删除已停止的容器
   使用`docker rm 容器ID`
   ![在这里插入图片描述](assets/docker学习使用记录/56fbd28569e247179c96fa4ce29c749b.png)
5. 删除还在运行的容器
   这个时候还用上面的方法删除会报错，提示容器还在运行，如果想要直接删除的话要带上`-f`
   使用`docker rm -f 容器ID`
   ![删除还在运行的容器示例](assets/docker学习使用记录/b431ae459efe40938984c5a39cdc0b10.png)
6. 启动已停止的容器
   使用`docker start 容器ID`启动已停止的容器
   ![启动已停止的容器示例](assets/docker学习使用记录/8024400eb8f040e1b44f0847a6b4f941.png)
7. 删除所有已停止的容器
   使用`docker rm $(docker ps -aq)`删除所有已停止的容器，使用`rm -f`的话是删除所有容器
   使用`docker rm`是删除，使用`docker ps -aq`是获取所有容器的ID
   `$()`在其他地方也可以用，例如停止所有，启动所有
   ![删除所有已停止的容器示例](assets/docker学习使用记录/d47789f6879c427cacf5b408f4b12f1e.png)

### 操作镜像

1. 删除镜像
   使用`docker rmi 镜像ID`删除镜像，`i`应该是`image`的意思吧，所以是删除镜像
   ![删除镜像示例](assets/docker学习使用记录/1cbb6a7fbbd7455e97249fb5193d5788.png)
   加上`-f`删除正在使用的镜像，例如被容器使用，不管容器有没有停止都是使用中
   ![删除正在使用的镜像](assets/docker学习使用记录/0e2873bbabbc47b3bc65c6e70f300182.png)
   使用`docker images -a`查看已经没有镜像了
   ![查看所有镜像](assets/docker学习使用记录/022b2676f6f947e6b90fde31b9ba203a.png)
   但是使用`docker ps -a`查了一下那个使用了nginx镜像的容器还在，试了一下可以正常启动，还可以正常使用，这个应该是容器和镜像的使用关系，这个没搞懂不乱说了，一般删除时应该先删除容器，再删除镜像
   ![查看容器列表](assets/docker学习使用记录/d439dca433544f17b1fcfa8ba8d6c865.png)

### 配置nginx

重新拉了一下nginx镜像，然后使用`docker run -it -d -p 80:80 -p 81:81 nginx /bin/bash`生成容器映射80和81端口
![生成nginx容器](assets/docker学习使用记录/2efd8323147f4d5db8632c567c4c7b75.png)
使用`docker exec -it 67e5d51670e0 /bin/bash`进入容器
![进入容器](assets/docker学习使用记录/f99c3c9c350d4368ab5c6837d93a24f4.png)
切换镜像源地址，不然`apt-get update`慢，下载东西也慢，切换可以参考[apt-get update 太慢,如何解决](https://yijiebuyi.com/blog/f03488dcc97ce9d0f0fdbcfce3d4a07b.html)，里面有写docker镜像里面如何更改镜像源
![切换镜像源示例](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_18,color_FFFFFF,t_70,g_se,x_16.png)
`apt-get update`更新镜像源
![更新镜像源](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_19,color_FFFFFF,t_70,g_se,x_16.png)
使用`apt-get install vim`下载vim编译器
过程报了个错

```
The following packages have unmet dependencies:
 ncurses-base : Breaks: libtinfo5 (< 6.1) but 6.0+20161126-1+deb9u2 is to be installed
E: Error, pkgProblemResolver::Resolve generated breaks, this may be caused by held packages.
123
```

![缺少依赖报错](assets/docker学习使用记录/038efdac4db54c5d8d962df238adaa44.png)
说什么没有满足的依赖项，这种缺啥装啥就行，这里看到少`libtinfo5`，就用`apt-get install libtinfo5`安装
![填写示例](assets/docker学习使用记录/41f6aa2ded1e4e37a316ef50b83065e4.png)
确认安装的时候一个字符都不能输错，包括英文逗号感叹号和空格
安装完成后安装vim，然后使用vim配了一下nginx，然后在相应文件下创建index.html写些东西测试
![配置nginx示例](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_10,color_FFFFFF,t_70,g_se,x_16.png)
启动nginx
![nginx测试示例](assets/docker学习使用记录/2920bfb482dc44698c56e8233e238a99.png)
![nginx测试示例](assets/docker学习使用记录/9f1cb39233f945578feabb0ba850d4e4.png)
完事，这个就相当于自己做完的东西，想做成自己的镜像，方便交付转移或保存

### 生成自己的镜像

```
docker commit -m="注释" -a="作者" 容器ID 要创建的镜像的名字:[版本号]
1
```

使用docker ps 查看容器，这个容器就是刚才被操作的容器，装了vim，写了文件
![查看容器列表](assets/docker学习使用记录/0ae27e8d99314f16821edd32b3aaead0.png)
使用`docker commit -m="添加vim，配置80、81端口的nginx" -a="sywdebug" 67e5d51670e0 my_nginx`生成镜像
![生成镜像](assets/docker学习使用记录/1599771dee9642f2bc06698097454ab4.png)
然后使用`docker images`查看就可以看到生成的my_nginx
![查看镜像列表](assets/docker学习使用记录/c60c58b7703d4560a218e722fc44fe78.png)
然后停止原来的容器，使用`docker run -it -d -p 80:80 -p 81:81 my_nginx /bin/bash`生成一个新的容器使用my_nginx镜像
![生成容器使用新生成的镜像](assets/docker学习使用记录/6c23cdc40ed741e9a0d035c2922bef0a.png)
然后进入容器
![进入容器](assets/docker学习使用记录/6b74b8b548484d769b6fa2ce1a7fc0b4.png)
可以看到是有之前使用创建的文件夹的
![查看文件列表](assets/docker学习使用记录/47ada693dd7d450598cc6acc0669b182.png)
启动nginx
![测试示例](assets/docker学习使用记录/c59a537861ce402fbcbe2e72618b3525.png)
可以正常访问

### 推送镜像到私有云

此处我使用的是腾讯云的容器镜像服务
首先新建命名空间
![新建命名空间](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_20,color_FFFFFF,t_70,g_se,x_16-1668926778819-1.png)
然后新建镜像仓库
![新建镜像仓库](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_20,color_FFFFFF,t_70,g_se,x_16-1668926778819-2.png)
创建完成后可以看到仓库右侧右快捷指令
![仓库列表](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_20,color_FFFFFF,t_70,g_se,x_16-1668926778819-3.png)
![快捷指令](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_20,color_FFFFFF,t_70,g_se,x_16-1668926778819-4.png)
可以看到有登陆，拉取镜像，推送镜像，上面我已经生成了自己的镜像，现在将镜像推送到仓库里

首先使用登陆指令登录腾讯云容器镜像服务 Docker Registry，登录时要输入密码，密码好像是启动容器镜像服务时设置的，因为我这个之前弄过忘记是不是了，如果不记得登陆密码可以在腾讯云控制台的容器镜像服务的实例管理重置登陆密码
![登录腾讯云容器镜像服务 Docker Registry](assets/docker学习使用记录/b29881fd3cd3484b817c696aa3e04168.png)
查看一下镜像的ID
![查看镜像ID](assets/docker学习使用记录/d5ac8191a2c149f2a178e45f75c21939.png)
使用向Registry推送指令的第一条`docker tag 5fe746e6ea98 hkccr.ccs.tencentyun.com/sywdebug/my_nginx`创建一个标签标记
然后再次查看，可以看到多出一个镜像
![创建标签标记](assets/docker学习使用记录/b59164ede69349ee8dd661db25d5c542.png)
然后使用推送的第二条指令`docker push hkccr.ccs.tencentyun.com/sywdebug/my_nginx`推送到仓库
我这里前面推送过一次，所以这里提示`layer already exists`，但是也已经推送上去了
![推送镜像到仓库](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_20,color_FFFFFF,t_70,g_se,x_16-1668926778819-5.png)
查看腾讯云容器镜像服务刚刚创建的仓库my_nginx，里面有一条记录
![在这里插入图片描述](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_20,color_FFFFFF,t_70,g_se,x_16-1668926778819-6.png)
至此，推送完成

### 从仓库拉取镜像测试

因为我windows电脑上也是有装docker的，所以拉下来测试一下
先登录腾讯云容器镜像服务 Docker Registry
![登录腾讯云容器镜像服务 Docker Registry](assets/docker学习使用记录/6a4e6fa32a544da39abc628c827aa117.png)
然后使用从 Registry 拉取镜像指令`docker pull hkccr.ccs.tencentyun.com/sywdebug/my_nginx`拉取镜像
![从 Registry 拉取镜像](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_20,color_FFFFFF,t_70,g_se,x_16-1668926778820-7.png)
可以看到已经拉下来了
![查看镜像列表](assets/docker学习使用记录/47f6741259ea42a3bbf6db4c1c1066c2.png)
生成容器运行一下这个镜像
![生成容器运行my_nginx镜像](assets/docker学习使用记录/71c1fe87519a44c887084e3c38fbf63a.png)
进入容器查看，可以看到没什么问题
![进入容器查看](assets/docker学习使用记录/d77cbe571403473e85754dc8f5bcf4e7.png)
用vim查看nginx.conf配置也是没问题
![nginx配置](assets/docker学习使用记录/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3l3ZGVidWc=,size_17,color_FFFFFF,t_70,g_se,x_16-1668926778820-8.png)
这里nginx就不启动了，因为上面配置了域名而不是使用127.0.0.1，而域名是解析到服务器，这里启动也是访问不到，整体来说docker镜像推拉仓库没什么问题

### 容器数据卷

#### 提示

Docker挂载主机目录访问如果出现`cannot open directory:Permission denied`，表示没有权限
解决：在挂载目录后加一个`--privileged=true`参数即可，开启这个容器内才拥有真正的root权限，否则容器内的root只是外部的一个普通用户权限

#### 使用

> 容器数据卷作用是将docker容器内的目录映射到宿主机的目录，众所周知，容器被删除后里面的数据都没有了，使用容器数据卷可以实现数据的持久化到本地主机目录，方便备份数据，容器卷更改实时生效
> 运行一个带有容器卷存储功能的容器实例

```
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内的目录 镜像名
1
```

-v也可以像上面的端口映射-p一样使用多个，也就是挂载多个目录

举例：
使用以下命令运行一个镜像为ubuntu并且带有数据卷的容器，容器将docker内部的/tmp/docker_data映射到宿主机的/tmp/host_data目录

```
docker run -it --privileged=true -v /tmp/host_data:/tmp/docker_data ubuntu
1
```

可以看到docker_data目前为空，宿主机的host_data也为空
![docker_data目录](assets/docker学习使用记录/6f2845726a164c42a2eefb77f49b733b.png)
![host_data](assets/docker学习使用记录/09644b5bc09b4192960237e31415a239.png)
然后在docker内部的docker_data创建一个文件
![创建docker_file文件](assets/docker学习使用记录/4957192685654b28a8fbcea6d2486331.png)
然后查看宿主机的host_data目录的文件，可以看到docker内部创建的这个文件
![host_data目录](assets/docker学习使用记录/12f23d4354fb46abb2e5fde36e8268f2.png)
在宿主机的host_data创建一个文件
![创建host_file文件](assets/docker学习使用记录/1072a089261a4240af6f812dd1f319c5.png)
然后查看docker内部的docker_data目录的文件，可以看到宿主机创建的这个文件
![docker_ddata目录](assets/docker学习使用记录/f2770a3dc4b14b628b1c70e92517ae05.png)
就像是vue的双向绑定一样
docker修改，主机同步获得
主机修改，docker同步获得
docker容器stop，主机修改，docker依然获得

#### 查看是否挂载

使用`docker inspect 容器ID`可以查看是否挂载成功
![查看容器挂载信息](assets/docker学习使用记录/279203ff62b34a9a847a333e496972de.png)

#### 权限

```
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内的目录 镜像名
1
```

上面默认创建命令是docker容器对于映射目录可读可写rw(read write)，相当于

```
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内的目录:rw 镜像名
1
```

如果要让docker容器对于映射目录只可读，可以将权限改为ro(read only)

```
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内的目录:ro 镜像名
1
```

修改为仅可读，再进行写操作就会提示`Read-only file system`

#### 继承

```
docker run -it --privileged=true --volumes-from 容器ID 镜像名
1
```

`--volumes-from`是父类的意思，也就是继承于哪个容器，按上面命令运行容器，父类容器什么样，这个新创建的就什么样，容器卷等等也是相同的
![举例](assets/docker学习使用记录/42ab6e2c6f044f3bad50008e63e02950.png)