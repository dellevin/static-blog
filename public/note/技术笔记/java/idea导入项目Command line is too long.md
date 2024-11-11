报错：
```java
Error running AdminApplication.Command line is too long. Shorten the command line via JAR manifest or via a classpath file and rerun.
```

昨天刚在新公司入职，准备接手项目的时候在导入过程中突然出现了这个错误。大概意思就是命令行太长了，你需要短一点。

因为自己还是哥小菜鸡，所以只剩下百度了。

**修改.idea下面的workspace.xml文件**

在``<component name="PropertiesComponent">` 这个标签里面添加一行，因为我的idea是2022.3.2所以这个文件里面的内容是json格式的。

```java
 "dynamic.classpath": "true"
```

老版本的idea则是添加

```html
<property name="dynamic.classpath" value="true" />
```

![Snipaste_2023-04-24_13-58-56](./assets/idea%E5%AF%BC%E5%85%A5%E9%A1%B9%E7%9B%AECommand%20line%20is%20too%20long/Snipaste_2023-04-24_13-58-56.jpg)