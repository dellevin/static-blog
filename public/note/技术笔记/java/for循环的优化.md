2022年11月12日17点52分

今天使用wincc oa的时候遍历excel表的时候，五千多行，慢的要死，最后还是归结自己的定义变量的随便。以至于自己写的程序拖慢了速度。
以下是几条优化for循环的方式

## 方法一：消除循环终止判断时的方法调用

优化前：

```java
for (int i = 0; i < list.size(); i++) {
	System.out.println(list.get(i));
}
```

优点：较常见，易于理解
缺点：每次都要计算list.size()

优化一：
将计算list长度提取出来

```java
int m = list.size();
for (int i = 0; i < m; i++) {
      System.out.println(list.get(i));
}
```

优点：将list长度提取出来，不必每次都计算
缺点：

1. m的作用域不够小，违反了最小作用域原则
2. 不能在for循环中操作list的大小，比如除去或新加一个元素

分析：
list.size()每次循环都会被执行一次，这无疑会影响程序的性能，所以应该将其放到循环外面，用一个变量来代替，优化前后的对比也很明显。

优化二：
将计算list长度提取出来

```java
for (int i = 0, n = list.size(); i < n; i++) {
      System.out.println(list.get(i));
} 
```

优点：不必每次都计算 ，变量的作用域遵循最小范围原则

优化三：
采用倒序的写法

```java
for (int i = list.size() - 1; i >= 0; i--) {
      System.out.println(list.get(i));
}
```

优点：不必每次都计算 ，变量的作用域遵循最小范围原则
缺点：

1. 结果的顺序会反
2. 看起来不习惯，不易读懂

适用场合：与显示结果顺序无关的地方：比如保存之前数据的校验

## 方法二：Iterator 遍历

```java
for (Iterator<String> it = list.iterator(); it.hasNext();) {
      System.out.println(it.next());
}
```

优点：简洁

## 方法三：jdk1.5新写法

```java
for (Object o : list) {
     System.out.println(o);
}
```

优点：简洁结合泛型使用更简洁
缺点：jdk1.4向下不兼容

## 方法四：循环嵌套外小内大原则（从外至里，循环对象size要从小到大）

优化前：

```java
for (int i = 0; i < 100000; i++) {
      for (int j = 0; j < 10; j++) {
         }
  }
```

优化后：

```java
for (int i = 0; i < 10; i++) {
      for (int j = 0; j < 100000; j++) {
         }
  }
```

理解：这就好比你复制很多个小文件和复制几个大文件的区别。

## 方法五：循环嵌套提取不需要循环的逻辑

优化前：

```java
 int a = 10, b = 11;
  for (int i = 0; i < 10; i++) {
               i = i * a * b;
   } 
```

优化后：

```java
 int c = a * b;
 for (int i = 0; i < 10; i++) {
         i = i * c;
  }
```

分析：代码中a*b与我们的循环无关，所以为避免重复计算，应该把它放到外面。优化后性能会提升好几个数量级，这些是不容忽视的。

## 方法六：异常处理写在循环外面

优化前：

```php
  for (int i = 0; i < 10; i++) {
          try {
 
              } catch (Exception e) {
 
              }
    }
```

优化后：

```java
try {
         for (int i = 0; i < 10; i++) {
                }
     } catch (Exception e) {
 
  }
```

分析：捕获异常是很耗资源的，所以不能将try catch放到循环内部，优化后同样有好几个数量级的提升