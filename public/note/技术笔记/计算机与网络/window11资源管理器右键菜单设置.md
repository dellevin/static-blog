# window11资源管理器右键菜单设置

```bash
bash复制代码# 管理员运行命令：
## 恢复win10右键菜单
reg.exe add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve 

## 恢复win11右键菜单
reg.exe delete "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /va /f

## 设置后重启资源管理器(任务管理器中找到重启或运行下面命令)
taskkill /f /im explorer.exe & start explorer.exe
```

# 菜单选项设置

- 1、Win + R 运行 regedit 打开注册表；
- 2、选中 `HKEY_CLASSES_ROOT -> * -> shell` ，新建项目，例如vscode
- 3、选中新建的项目vscode，在项目下新建字符串值，如图：![image.png](./assets/window11%E8%B5%84%E6%BA%90%E7%AE%A1%E7%90%86%E5%99%A8%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%E8%AE%BE%E7%BD%AE/2570863f5591442588146fbc0a0022fatplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)
- 4、在vscode下新建项command，设置项command的字符串值数据，如图：![image.png](./assets/window11%E8%B5%84%E6%BA%90%E7%AE%A1%E7%90%86%E5%99%A8%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%E8%AE%BE%E7%BD%AE/d2ead11c6c5948b8b0c721d565ba5e7etplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)
- 5、选中 `HKEY_CLASSES_ROOT->Directory->shell`，新建项目vscode，选中新建的项目vscode，在项目下新建字符串值icon，设置数据（同步骤3图）；
- 6、选中（5、新建的vscode）新建项目command，设置项command的字符串值数据（同步骤4图）

