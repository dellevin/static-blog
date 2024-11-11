今天脑子突然抽了，截取字符的时候

想把

[1651114259328487426]

截取成

1651114259328487426

我知道是substring从1开始截取，但是为什么最后是length()-1呢，一开始-2我还很疑惑，看了一些文档才反应过来。

- **beginIndex** -- 起始索引（包括）, 索引从 0 开始。

- **endIndex** -- 结束索引（不包括）。

原来是最后的索引是不包括的呀。。。自己真的蠢到家了，自己把自己蠢到了，说到底基础还是不扎实。

**Java截取最后一个/后面的所有字符**

```java
String imgUrl = "http://127.0.0.1:8080/cms/ReadAddress/1479805098158.jpg";

String image = imgUrl.substring(imgUrl.lastIndexOf("/")+1);
```

