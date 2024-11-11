受限于电脑比较垃圾，23年了，还用着五年前的电脑。再加之软件更新迭代快，对性能的要求也渐渐地有了要求。自己也开始对系统开始做一些优化，禁用一些不需要的服务。必要时再开启。昨晚上半夜学了点bat的操作方式，写了俩脚本耍耍。

因为涉及到服务启动，所以都需要管理员权限运行。

`mysql`开关脚本：

```bash

@echo off

 for /f "skip=3 tokens=4" %%i in ('sc query mysql') do set "zt=%%i" &goto :next  
:next  
if /i "%zt%"=="RUNNING" (  
echo ======================================== 
echo       该服务mysql现在处于 开启状态  
echo         %date:~0,4%年%date:~5,2%月%date:~8,2%日%time:~0,2%时%time:~3,2%分
echo ======================================== 
) else (  
echo ======================================== 
echo       该服务mysql现在处于 停止状态  
echo         %date:~0,4%年%date:~5,2%月%date:~8,2%日%time:~0,2%时%time:~3,2%分
echo ======================================== 
)  

choice /c:YN  /m "开启[Y]关闭[N] MySQL 服务" 
 
 if errorlevel 2 goto two 
 
 if errorlevel 1 goto one 
 
 :one a
 
 echo 正在开启 MySQL 服务... 
 
 net start mysql
 
 echo MySQL 服务开启成功
 
 choice /c:YN /m "是[Y]否[N]要开启SQLyong" 
 
 if errorlevel 2 exit 
 
 if errorlevel 1 start "" "D:\Program Files\Webyog SQLyog Ultimate\SQLyog.exe"
 
 >nul
 
 :two 
 
 echo 正在关闭 MySQL 服务... 
 
 net stop mysql 
 
 echo MySQL 服务关闭成功 
 
 taskkill /f /im "SQLyog.exe"

 echo 请按任意键退出... 
 
 pause>nul 
 
 exit 
```

`VM`开关脚本：

```bash
@echo off
 
 for /f "skip=3 tokens=4" %%i in ('sc query "VMAuthdService"') do set "zt=%%i" &goto :next 
 
 :next 
 
 if /i "%zt%"=="RUNNING" ( 
 
 echo 服务VMware Authorization Service正在运行 
 
 ) else ( 
 
 echo 服务VMware Authorization Service已停止 
 
 ) 
 
 for /f "skip=3 tokens=4" %%i in ('sc query "VMnetDHCP"') do set "zt=%%i" &goto :next 
 
 :next 
 
 if /i "%zt%"=="RUNNING" ( 
 
 echo 服务VMware DHCP Service正在运行 
 
 ) else ( 
 
 echo 服务VMware DHCP Service已停止 
 
 ) 
 
 for /f "skip=3 tokens=4" %%i in ('sc query "VMware NAT Service"') do set "zt=%%i" &goto :next 
 
 :next 
 
 if /i "%zt%"=="RUNNING" ( 
 
 echo 服务VMware NAT Service正在运行 
 
 ) else ( 
 
 echo 服务VMware NAT Service已停止 
 
 ) 
 
 for /f "skip=3 tokens=4" %%i in ('sc query "VMUSBArbService"') do set "zt=%%i" &goto :next 
 
 :next 
 
 if /i "%zt%"=="RUNNING" ( 
 
 echo 服务VMware USB Arbitration Service正在运行 
 
 ) else ( 
 
 echo 服务VMware USB Arbitration Service已停止 
 
 ) 
 
 for /f "skip=3 tokens=4" %%i in ('sc query "VMwareHostd"') do set "zt=%%i" &goto :next 
 
 :next 
 
 if /i "%zt%"=="RUNNING" ( 
 
 echo 服务VMware Workstation Server正在运行 
 
 ) else ( 
 
 echo 服务VMware Workstation Server已停止 
 
 ) 
 
 choice /c:12 /m "启动/停止VM虚拟机服务及网络连接[1启动,2停止]" 
 
 if errorlevel 2 goto two 
 
 if errorlevel 1 goto one 
 
 :one 
 
 echo 正在启用VM各项服务，请耐心等待......
 
 net start "VMnetDHCP" 
 
 net start "VMware NAT Service" 
 
 net start "VMUSBArbService" 
 
 net start "VMAuthdService" 
 
 ::net start "VMwareHostd" 
 
 echo 正在启用网络连接... 
 
 netsh interface set interface "VMware Network Adapter VMnet1" enable 
 
 netsh interface set interface "VMware Network Adapter VMnet8" enable 
 
 echo 网络连接VMware Network Adapter VMnet1、VMware Network Adapter VMnet8启动成功 
 
 choice /c:12 /m " 是否启动VMware Workstations...[1是,2否]" 
 
 if errorlevel 2 exit 
 
 if errorlevel 1 start "" "D:\Program Files (x86)\VMware\VMware Workstation\vmware.exe"
 
 >nul
 
 :two 
 
 echo 正在禁用VM各项服务,请耐心等待......
 
 ::net stop "VMwareHostd" 
 
 net stop "VMnetDHCP" 
 
 net stop "VMware NAT Service" 
 
 net stop "VMUSBArbService" 
 
 net stop "VMAuthdService" 
 
 echo 正在禁用网络连接... 
 
 netsh interface set interface "VMware Network Adapter VMnet1" disable 
 
 netsh interface set interface "VMware Network Adapter VMnet8" disable 
 
 echo 网络连接VMware Network Adapter VMnet1、VMware Network Adapter VMnet8禁用成功 

 taskkill /f /im "vmware.exe"
 
 echo 按任意键退出... 
 
 pause>nul 
 
 exit 
```
刚才再写操作日志的时候，因为涉及到时间的缘故，偶然间学了一手
![excel当前时间.gif](./assets/excel当前时间.gif)
