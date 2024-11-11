请实现一个函数，把字符串 `s` 中的每个空格替换成"%20"。

 

**示例 1：**

```bash
输入：s = "We are happy."
输出："We%20are%20happy."
```

 

**限制：**

```bash
0 <= s 的长度 <= 10000
```

## 代码

```java
class Solution {
    public String replaceSpace(String s) {
        return s.replace(" ","%20");
    }
}
```

