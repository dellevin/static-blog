报错：
		Error Code: 1067 - Invalid default value for 'LOCK_TIME_'

查阅资料知道是mysql从5.7开始，默认是严格模式，严格遵从SQL92规范。

公司mysql版本：5.7.25

我的mysql版本：5.7.40

因为mysql差距不大的原因，所以猜测，应该是我没开启timestamp默认值规则

先查看是否开启了

```dart
 show variables like 'explicit_defaults_for_timestamp'; 
```

忘了截图了，不过查询出来的结果是off

**设置开启**

```sql
set global explicit_defaults_for_timestamp = ON;
```

再次查看是否开启

![Snipaste_2023-04-24_13-49-42](./assets/Error%20Code%201067%20-%20Invalid%20default%20value%20for/Snipaste_2023-04-24_13-49-42.jpg)

开启了，然后再次导入数据库。就可以了。

还有一种解决方式是去除掉关于时间这些not null字段，也可以，不过实在是太多了，所以就没有选择此种方法。

参考连接：

https://www.jianshu.com/p/523a0bf27095

https://blog.csdn.net/u010227042/article/details/123321421