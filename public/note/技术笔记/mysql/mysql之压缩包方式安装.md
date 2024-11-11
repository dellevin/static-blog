今天重装了系统，搞了半天才搞好，后来想起来``mysql`这么关键的东西竟然没安装，实在是蠢。网上找了半天没有`msi`的安装器，只能`google`学习用压缩包方式安装了。。。特此学习记录

## 下载

下载地址（选择该地址可以下载历史版本）
https://downloads.mysql.com/archives/community/

## 安装

### 解压到路径



![image-20230218181433632](./assets/mysql%E4%B9%8B%E5%8E%8B%E7%BC%A9%E5%8C%85%E6%96%B9%E5%BC%8F%E5%AE%89%E8%A3%85/image-20230218181433632.png)

### **在解压目录下创建my.ini**

```bash
[client]
# 设置mysql客户端默认字符集
default-character-set=utf8

[mysqld]
# 设置3306端口
port=3306
character_set_server=utf8
# 解压目录
basedir=D:\Environment\mysql-5.7.40
# 解压目录下data目录,这里血药自己创建data
datadir=D:\Environment\mysql-5.7.40\data
default-storage-engine=INNODB

sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES

[WinMySQLAdmin]
D:\Environment\mysql-5.7.40\bin\mysqld.exe
```

### 设置`MYSQL`的环境变量

- 新增系统变量 `MYSQL_HOME`路径写`D:\Environment\mysql-5.7.40`
- 在系统变量Path后面追加`;%MYSQL_HOME%\bin`

### 安装`MYSQL`



在解压目录的\bin下（`D:\Environment\mysql-5.7.40\bin`），开启命令窗口，这里我用的是`cmder`

**执行命令初始化数据库**

```bash
mysqld -install
mysqld --initialize --console
```

![image-20230218182054841](./assets/mysql%E4%B9%8B%E5%8E%8B%E7%BC%A9%E5%8C%85%E6%96%B9%E5%BC%8F%E5%AE%89%E8%A3%85/image-20230218182054841.png)

`mysqld --initialize --console`命令，可以得到`mysql`的初始密码，用`mysqld --initialize `的目的是初始化data目录。红框之内的是我的密码的位置。



接着就是在输入``net start mysql``启动服务(**这里需要管理员权限**)

开始使用``mysql`，输入命令：`mysql -uroot -p`，然后输入刚才的初始密码

修改密码

```bash
mysql> alter user 'root'@'localhost' identified by '123456';
Query OK, 0 rows affected (0.00 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)

mysql> exit;
Bye
```

- 输入命令：`mysql -uroot -p`，然后尝试新密码
