### 查看防火墙状态： 

`systemctl status firewalld`

**running**表示防火墙开启

### 关闭防火墙命令： 

`systemctl stop firewalld`

### 开机禁用防火墙自启命令 ： 

`systemctl disable firewalld.service`