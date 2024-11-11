卸载安装老版本的即可
```cobol
npm uninstall less-loader

npm install less-loader@5.0.0
```

### 报错信息

TypeError: this.getOptions is not a function 这个是在运行项目是遇到的问题

![img](./assets/TypeError%20this.getOptions%20is%20not%20a%20function%20%E7%9A%84%E8%A7%A3%E5%86%B3(vue,react)/20210725131325906.png)

​                                     **vue**

![img](./assets/TypeError%20this.getOptions%20is%20not%20a%20function%20%E7%9A%84%E8%A7%A3%E5%86%B3(vue,react)/20210725131419470.png)                                    											**react**



这个报错是类型错误，this.getOptions 不是一个函数 。这个错误是less-loader库里的错误。

主要是less-loader版本太高，不兼容this.getOptions方法。

### 解决方案

通过 `npm uninstall less-loader` 命令卸载原版本的 `less-loader`，然后 通过 `npm install less-loader@5.0.0` 命令下载降级版本的 `less-loader`，这个问题就可以解决了.

```cobol
npm uninstall less-loader

npm install less-loader@5.0.0
```

或者可以删除node_modules文件夹，并且把package.json里less-loader里的版本改为5.0.0就行，然后npm install

不止 less-loader 同样 scss-loader ,css-loader，style-loader都有可能出现 。

![img](./assets/TypeError%20this.getOptions%20is%20not%20a%20function%20%E7%9A%84%E8%A7%A3%E5%86%B3(vue,react)/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bS95bS955qE6LC36Zuo,size_20,color_FFFFFF,t_70,g_se,x_16.png)

 只需要 看报错 具体 是什么 上图 为例 报的是css-loader .所以 卸载对应得就行。

```cobol
npm uninstall css-loader

npm install css-loader@5.0.0
```

具体降到哪个版本 需要 看看 版本信息 比如 style-loader

style-loader)降低 到 之前的版本 比如 2.0.0