### 1. 下载 MySQL的yum包

也可以自己从官方下载

```javascript
wget http://repo.mysql.com/mysql57-community-release-el7-10.noarch.rpm
```

###  2.安装MySQL源

```javascript
rpm -Uvh mysql57-community-release-el7-10.noarch.rpm
```

### 3.安装MySQL服务端,需要等待一些时间

```javascript
yum install -y mysql-community-server
```

### 4.启动MySQL

```javascript
systemctl start mysqld.service
```

### 5.检查是否启动成功

```javascript
systemctl status mysqld.service
```

### 6.获取临时密码，

MySQL5.7为root用户随机生成了一个密码

```javascript
grep 'temporary password' /var/log/mysqld.log 
```

### 7.通过临时密码登录

通过临时密码登录MySQL，进行修改密码操作

```javascript
mysql -uroot -p
```

使用临时密码登录后，不能进行其他的操作，否则会报错，这时候我们进行修改密码操作

### 8.设置mysql密码规则

因为MySQL的密码规则需要很复杂，我们一般自己设置的不会设置成这样，所以我们全局修改一下

```javascript
mysql> set global validate_password_policy=0;
mysql> set global validate_password_length=1;
```



这时候我们就可以自己设置想要的密码了

```javascript
ALTER USER 'root'@'localhost' IDENTIFIED BY 'yourpassword';
```



### 9.授权其他机器远程登录

```javascript
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'yourpassword' WITH GRANT OPTION;
 
FLUSH PRIVILEGES;
```

### 10.开启开机自启动

先退出mysql命令行，然后输入以下命令

```javascript
systemctl enable mysqld
systemctl daemon-reload
```

### 11.设置MySQL的字符集为UTF-8，令其支持中文

```javascript
vim /etc/my.cnf
```

复制

改成如下,然后保存

```javascript
# For advice on how to change settings please see
# http://dev.mysql.com/doc/refman/5.7/en/server-configuration-defaults.html
 
[mysql]
default-character-set=utf8
 
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
default-storage-engine=INNODB
character_set_server=utf8
 
symbolic-links=0
 
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
```

### 12.重启一下MySQL,令配置生效

```javascript
service mysqld restart
```

### 13.防火墙开放3306端口

```javascript
firewall-cmd --state
firewall-cmd --zone=public --add-port=3306/tcp --permanent
firewall-cmd --reload
```

### 14.卸载MySQL仓库

一开始的时候我们安装的yum，每次yum操作都会更新一次，耗费时间，我们把他卸载掉

```javascript
rpm -qa | grep mysql
```

```javascript
yum -y remove mysql57-community-release-el7-10.noarch
```

### 15.数据库的操作

（1）查看mysql是否启动：`service mysqld status`

启动mysql：`service mysqld start`

停止mysql：`service mysqld stop`

重启mysql：`service mysqld restart`

（2）查看临时密码：`grep password /var/log/mysqld.log`