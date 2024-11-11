

使用yum安装MySQL时报错

`yum -y install mysql mysql-server`

`yum -y install mysql-community-server`

报错内容如下

```shell
warning: /var/cache/yum/x86_64/7/mysql57-community/packages/mysql-community-libs-compat-5.7.37-1.el7.x86_64.rpm: Header V4 RSA/SHA256 Signature, key ID 3a79bd29: NOKEY
从 file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql 检索密钥
源 "MySQL 5.7 Community Server" 的 GPG 密钥已安装，但是不适用于此软件包。请检查源的公钥 URL 是否配置正确。
失败的软件包是：mysql-community-libs-compat-5.7.37-1.el7.x86_64
GPG  密钥配置为：file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
```

**处理方式有两种**

1. **到mysql官网下载校验文件**

2. **修改配置跳过校验**

   1.编辑文件
   `/etc/yum.repos.d/mysql-community.repo`
   2.修改对应安装版本的`gpgcheck=0`即可,默认值为1

```shell
[mysql57-community]
name=MySQL 5.7 Community Server
baseurl=http://repo.mysql.com/yum/mysql-5.7-community/el/7/$basearch/
enabled=1
gpgcheck=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
```

再次执行安装即可