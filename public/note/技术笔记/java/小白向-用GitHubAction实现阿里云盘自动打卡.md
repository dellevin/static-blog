开门见山，针对程序员来说，如果每天都手动签到岂不是很费力，昨天和我同学闲聊的时候，发现他在用py实现各种签到的打卡，看的我是狠狠的抽自己脸，怎么能手动打卡呢！！！尊严何在？

因为上个月在吾爱上看见一个[zhuoxin99](https://www.52pojie.cn/home.php?mod=space&uid=1942406)大佬发了一个[某盘签到](https://www.52pojie.cn/forum.php?mod=viewthread&tid=1785892&extra=page%3D1%26filter%3Dtypeid%26typeid%3D388)的一个java项目，今天正好心血来潮准备改改修修补补的。因为对GitHub的Action没有什么了解，所以有点怵头。修修补补最终是弄好了

项目地址：https://github.com/dellevin/ToDoTaskForGithubAction

下面针对像我这样的技术小白说一下几个技术要点：

## 创建工作流

在`./github/workflows` 的文件夹下面创建yml文件，文件名随便，后缀名一定是yml的格式

## 编写配置

下面贴一下我的完整配置

```yml
name: Java CI
on:
  schedule:
    - cron: "30 22 * * *"  # 北京时间上午06:30
  workflow_dispatch:   # 添加 workflow_dispatch 触发器，用于手动运行
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up JDK
      uses: actions/setup-java@v1
      with:
        java-version: '11' # 这里可以指定你需要的 Java 版本

    - name: Cache Maven packages
      uses: actions/cache@v2
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
        restore-keys: ${{ runner.os }}-m2

    - name: Build with Maven
      run: mvn -B package --file pom.xml   # 使用 Maven 进行项目构建，可以根据你的项目需要修改命令

    - name: run Java Application
      run: |
        java -Djava.security.manager -Djava.security.policy==src/main/resources/policy.policy -jar  target/ToDoTask.jar
      # 附带权限加载运行程序
      env:
        REFRESH_TOKEN: ${{ secrets.REFRESH_TOKEN }}


```

`name: Java CI`表示我的工作流叫做Java CI

on里面我就不写了，已经打注释了

接下来是重头戏是job里面的东西们

`runs-on: ubuntu-latest`表示我在这个ubuntu的系统上运行的（一个linux系统）

`build`任务首先做checkout代码操作。

接下来是构建步骤，

`- name` 表示我这个步骤叫什么名



下面表示我是java11版本运行的

```yml
uses: actions/setup-java@v1
      with:
        java-version: '11' # 这里可以指定你需要的 Java 版本
```

这一步表示 缓存Maven本地包,加速构建，避免了每次运行都要下载maven里面引入的包（ps：我是看别人写的copy过来的）

```yml
    - name: Cache Maven packages
      uses: actions/cache@v2
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
        restore-keys: ${{ runner.os }}-m2
```

使用Maven进行项目打包构建。

```yml
- name: Build with Maven
  run: mvn -B package --file pom.xml   # 使用 Maven 进行项目构建，可以根据你的项目需要修改命令
```

最后调用Java命令运行打包生成的JAR文件

```yml
- name: run Java Application
  run: |
    java -Djava.security.manager -Djava.security.policy==src/main/resources/policy.policy -jar  target/ToDoTask.jar
  # 附带权限加载运行程序
  env:
    REFRESH_TOKEN: ${{ secrets.REFRESH_TOKEN }}
```

其中`-Djava.security.manager -Djava.security.policy==src/main/resources/policy.policy`的作用是设置权限，让github设置的screct传入进来，也就是传入到ToDoTask类里面的`private static final String refresh_token = System.getenv("REFRESH_TOKEN");`里面，其中`System.getenv("REFRESH_TOKEN")`就是用来获取GitHub设置的screct的，通过yml配置文件里面的，

```yml
  env:
    REFRESH_TOKEN: ${{ secrets.REFRESH_TOKEN }}
```

进行传入，如果不加入`-Djava.security.manager -Djava.security.policy==src/main/resources/policy.policy`这句话的话refresh_token 获取的一直是null。。。。。

因为我每次运行都是各种权限错误，运行一次加一次，最后索性在policy文件下面加了一个`permission java.security.AllPermission;`释放所有权限

报错log（部分）

```java
----1
Error: Exception in thread "main" java.lang.IllegalStateException: java.security.AccessControlException: access denied ("java.lang.RuntimePermission" "getProtectionDomain")
----2
access denied ("java.lang.RuntimePermission" "setFactory")
----3
access denied ("java.util.PropertyPermission" "java.protocol.handler.pkgs" "read")
----4
access denied ("java.util.PropertyPermission" "java.protocol.handler.pkgs" "write")
----5
access denied ("java.lang.RuntimePermission" "getProtectionDomain")
    
然后好多权限报错问题，运行一次报一次。。。。。。
```



### yml配置之 项目切忌class方式运行

一开始我是懵的，创建的是springboot的项目，然后就要编写如何运行java文件的东西，一开始我选择的是采用直接编译java文件运行class类的方式。

这种方式是大错特错的，因为是项目的原因，必须要引入这个

```
name: Build with Maven
run: mvn -B package --file pom.xml 
```

### pom配置之 一定要加bulid

也就是说一定要加入下面这段，finalName标签是必须要的，因为是打包成一个jar包运行的是一个jar包，你不加finalName人家都不知道运行啥，运行class文件吗，别搞笑了。

另外plugins标签里面也一定要加上，因为该插件提供了打包和运行Spring Boot项目的能力。添加这个插件后可以直接使用mvn spring-boot:run来运行Spring Boot应用，我不加上无法运行jar包。。。。

```xml
<build>
    <!--    打包后的文件名-->
    <finalName>ToDoTask</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

### java文件之获取传入进来的token

我一直好奇的是`REFRESH_TOKEN: ${{ secrets.REFRESH_TOKEN }}`这段是如何传入进来的，结果百度无果之后果断问了gpt，他告诉我用`System.getenv("REFRESH_TOKEN")`接收就好（ps：gpt真厉害）。在我运行工作流之后，发现token是null，很明显是没传入进来嘛，然后又去问，他告诉我要设置权限，也就是上面提到的哪些。。。。这样下来，最终是完成了这个

其中

```yml
env:
    REFRESH_TOKEN: ${{ secrets.REFRESH_TOKEN }}
```

这一段你要放在外面就是全局变量，你要放在里面就是局部变量



## 注意

Github Action对于公有仓库是免费的，对于私有仓库用户提供了一定的免费额度：

- 对于运行在Linux上的作业，github提供了2000分钟的免费额度；
- Github提供了10G免费的缓存，并且会对7天内未被访问的key进行删除；
- 以上的使用限额，会在每个月进行重置；