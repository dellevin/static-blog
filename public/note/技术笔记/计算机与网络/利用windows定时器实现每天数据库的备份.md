事情的起因是今早上我更改前端页面的时候忽然发现，前端数据显示全是一系列的乱码什么的，似乎是被人恶意注入了，简直太痛了。自己没有mysql定时备份的习惯，所以只能含泪偷哭，好在我同事有，多亏他救了一命，还好数据还在。但是他每天都手动备份，着实有些麻烦了。小小的偷懒一下，懒惰是人们进步的阶梯。

因为windows有**任务计划程序**的原因，所以我们只需要写好bash脚本就可以。

## bash

```bash
:: 配置数据库用户
SET DB_USER=root

:: 配置数据库密码
SET DB_PASSWORD=root123

:: 配置备份的数据库名称
SET DB_NAME=security_enterprise

:: 配置备份的文件路径
SET SAVE_PATH=D:\MySqlBackup

:: 配置mysqldump的路径,有空格的要加上双引号
SET MYSQL_DUMP_PATH=D:\Environment\mysql-5.7.40\bin\mysqldump.exe

:: 开始工作
:: 跳转到工作目录下
%SAVE_PATH:~0,2%
cd %SAVE_PATH%
:: 设置变量：备份文件名
SET BAK_FILE=%SAVE_PATH%\security_enterprise_bak_%date:~0,4%_%date:~5,2%_%date:~8,2%.sql
:: 开始做备份
%MYSQL_DUMP_PATH% -u%DB_USER% -p%DB_PASSWORD% %DB_NAME%>%BAK_FILE%
```

在里面很清楚了，在此不做赘述。

## windows任务计划程序

#### 设置名称描述以及安全选项

![image-20230526163017565](./assets/%E5%88%A9%E7%94%A8windows%E5%AE%9A%E6%97%B6%E5%99%A8%E5%AE%9E%E7%8E%B0%E6%AF%8F%E5%A4%A9%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E5%A4%87%E4%BB%BD/image-20230526163017565.png)

#### 设置触发器

![image-20230526163100444](./assets/%E5%88%A9%E7%94%A8windows%E5%AE%9A%E6%97%B6%E5%99%A8%E5%AE%9E%E7%8E%B0%E6%AF%8F%E5%A4%A9%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E5%A4%87%E4%BB%BD/image-20230526163100444.png)

#### 设置操作

![image-20230526163135810](./assets/%E5%88%A9%E7%94%A8windows%E5%AE%9A%E6%97%B6%E5%99%A8%E5%AE%9E%E7%8E%B0%E6%AF%8F%E5%A4%A9%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E5%A4%87%E4%BB%BD/image-20230526163135810.png)

#### 设置一下意外情况

这里是防止备份失败进行的容错处理，可以做此步骤

![image-20230526163201647](./assets/%E5%88%A9%E7%94%A8windows%E5%AE%9A%E6%97%B6%E5%99%A8%E5%AE%9E%E7%8E%B0%E6%AF%8F%E5%A4%A9%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E5%A4%87%E4%BB%BD/image-20230526163201647.png)

经过一系列的设置，就会每天在固定时间在我的D:\MySqlBackup目录下面生成一个备份文件，防止出错了。

![image-20230526163418228](./assets/%E5%88%A9%E7%94%A8windows%E5%AE%9A%E6%97%B6%E5%99%A8%E5%AE%9E%E7%8E%B0%E6%AF%8F%E5%A4%A9%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E5%A4%87%E4%BB%BD/image-20230526163418228.png)